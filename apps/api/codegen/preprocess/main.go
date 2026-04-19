// Package preprocess is a tiny one-shot YAML transformer that converts
// OpenAPI 3.1 nullable typing — `type: [X, "null"]` — into OpenAPI 3.0
// style — `type: X` + `nullable: true`.
//
// This unblocks oapi-codegen v2 (see TD-007 in docs/TECH_DEBT.md and
// https://github.com/oapi-codegen/oapi-codegen/issues/373). The original
// spec file is NEVER mutated; the tool writes a temp file that is only
// consumed by codegen and then deleted by the Makefile target.
//
// Usage:
//
//	go run ./codegen/preprocess -in ../../tools/openapi/openapi.yaml -out /tmp/openapi.3.0.yaml
package main

import (
	"flag"
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

func main() {
	inPath := flag.String("in", "", "input OpenAPI 3.1 YAML file")
	outPath := flag.String("out", "", "output OpenAPI 3.0-style YAML file")
	flag.Parse()

	if *inPath == "" || *outPath == "" {
		fmt.Fprintln(os.Stderr, "usage: preprocess -in <spec> -out <spec>")
		os.Exit(2)
	}

	raw, err := os.ReadFile(*inPath)
	if err != nil {
		fatal("read input: %v", err)
	}

	var root yaml.Node
	if err := yaml.Unmarshal(raw, &root); err != nil {
		fatal("parse input: %v", err)
	}

	count := 0
	walk(&root, &count)

	// Known Go-name collisions: the inline enum `PortfolioPerformance.benchmark`
	// auto-generates a Go type named `PortfolioPerformanceBenchmark`, which
	// collides with the top-level schema of the same name. Renaming the
	// top-level schema via x-go-name resolves the collision without touching
	// field names in the generated client.
	injected := injectXGoName(&root,
		[]string{"components", "schemas", "PortfolioPerformanceBenchmark"},
		"PortfolioBenchmarkComparison")
	if injected {
		fmt.Fprintln(os.Stderr, "preprocess: injected x-go-name for PortfolioPerformanceBenchmark")
	}

	out, err := yaml.Marshal(&root)
	if err != nil {
		fatal("marshal output: %v", err)
	}

	if err := os.WriteFile(*outPath, out, 0o644); err != nil {
		fatal("write output: %v", err)
	}

	fmt.Fprintf(os.Stderr, "preprocess: rewrote %d nullable union types\n", count)
}

// walk mutates n in place, rewriting 3.1-style nullable unions to 3.0.
func walk(n *yaml.Node, count *int) {
	if n == nil {
		return
	}

	if n.Kind == yaml.MappingNode {
		rewriteNullableUnion(n, count)
		rewriteNullableOneOf(n, count)
	}

	for _, c := range n.Content {
		walk(c, count)
	}
}

// rewriteNullableOneOf: if the mapping has `oneOf: [...]` where at least
// one element is `{ type: "null" }`, drop that element and add
// `nullable: true` at the mapping level. Collapses oneOf to the single
// remaining schema if only one non-null branch remains.
func rewriteNullableOneOf(m *yaml.Node, count *int) {
	var oneOfVal *yaml.Node
	oneOfIdx := -1
	hasNullable := false

	for i := 0; i+1 < len(m.Content); i += 2 {
		k := m.Content[i]
		v := m.Content[i+1]
		if k.Value == "oneOf" && v.Kind == yaml.SequenceNode {
			oneOfVal = v
			oneOfIdx = i + 1
		}
		if k.Value == "nullable" {
			hasNullable = true
		}
	}

	if oneOfVal == nil {
		return
	}

	filtered := make([]*yaml.Node, 0, len(oneOfVal.Content))
	dropped := false
	for _, item := range oneOfVal.Content {
		if isNullOnlySchema(item) {
			dropped = true
			continue
		}
		filtered = append(filtered, item)
	}

	if !dropped {
		return
	}

	switch len(filtered) {
	case 0:
		return
	case 1:
		m.Content[oneOfIdx-1] = &yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: "$ref"}
		m.Content[oneOfIdx] = filtered[0].Content[1]
		if filtered[0].Content[0].Value != "$ref" {
			m.Content[oneOfIdx-1] = filtered[0].Content[0]
			m.Content[oneOfIdx] = filtered[0].Content[1]
		}
	default:
		oneOfVal.Content = filtered
	}

	if !hasNullable {
		m.Content = append(m.Content,
			&yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: "nullable"},
			&yaml.Node{Kind: yaml.ScalarNode, Tag: "!!bool", Value: "true"},
		)
	}

	*count++
}

// injectXGoName walks the document to a given mapping path and inserts
// `x-go-name: <name>` at that mapping. Returns false if the path does not
// exist (callers decide whether a missing node is an error).
func injectXGoName(root *yaml.Node, path []string, name string) bool {
	node := root
	if node.Kind == yaml.DocumentNode && len(node.Content) > 0 {
		node = node.Content[0]
	}
	for _, seg := range path {
		if node.Kind != yaml.MappingNode {
			return false
		}
		found := false
		for i := 0; i+1 < len(node.Content); i += 2 {
			if node.Content[i].Value == seg {
				node = node.Content[i+1]
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	if node.Kind != yaml.MappingNode {
		return false
	}
	for i := 0; i+1 < len(node.Content); i += 2 {
		if node.Content[i].Value == "x-go-name" {
			node.Content[i+1].Value = name
			return true
		}
	}
	node.Content = append(node.Content,
		&yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: "x-go-name"},
		&yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: name},
	)
	return true
}

// isNullOnlySchema reports whether n is a mapping `{type: "null"}` (with
// or without extras we don't care about for the null pattern).
func isNullOnlySchema(n *yaml.Node) bool {
	if n == nil || n.Kind != yaml.MappingNode {
		return false
	}
	for i := 0; i+1 < len(n.Content); i += 2 {
		k := n.Content[i]
		v := n.Content[i+1]
		if k.Value == "type" && v.Kind == yaml.ScalarNode && v.Value == "null" {
			return true
		}
	}
	return false
}

// rewriteNullableUnion: if the mapping has `type: [X, "null"]` (in any
// order), replace with `type: X` and add `nullable: true` (only if no
// existing nullable key).
func rewriteNullableUnion(m *yaml.Node, count *int) {
	var typeKey, typeVal *yaml.Node
	typeIdx := -1
	hasNullable := false

	for i := 0; i+1 < len(m.Content); i += 2 {
		k := m.Content[i]
		v := m.Content[i+1]
		if k.Value == "type" && v.Kind == yaml.SequenceNode {
			typeKey, typeVal, typeIdx = k, v, i+1
		}
		if k.Value == "nullable" {
			hasNullable = true
		}
	}

	if typeKey == nil || typeVal == nil {
		return
	}

	var primary *yaml.Node
	nullSeen := false
	for _, item := range typeVal.Content {
		switch item.Value {
		case "null":
			nullSeen = true
		default:
			if primary == nil {
				primary = item
			}
		}
	}

	if !nullSeen || primary == nil {
		return
	}

	// Collapse `type: [X, null]` → `type: X`.
	m.Content[typeIdx] = &yaml.Node{
		Kind:  yaml.ScalarNode,
		Tag:   "!!str",
		Value: primary.Value,
	}

	if !hasNullable {
		m.Content = append(m.Content,
			&yaml.Node{Kind: yaml.ScalarNode, Tag: "!!str", Value: "nullable"},
			&yaml.Node{Kind: yaml.ScalarNode, Tag: "!!bool", Value: "true"},
		)
	}

	*count++
}

func fatal(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "preprocess: "+format+"\n", args...)
	os.Exit(1)
}
