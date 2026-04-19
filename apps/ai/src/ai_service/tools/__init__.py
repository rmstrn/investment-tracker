"""Tool definitions that Claude can call through the AI Service's tool-use loop.

Each tool is a thin wrapper over a Core API endpoint. Schemas are authored in
the Anthropic tool-use format; execution dispatches to ``CoreAPIClient``.
"""
