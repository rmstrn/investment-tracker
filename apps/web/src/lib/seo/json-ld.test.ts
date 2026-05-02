import { describe, expect, it } from 'vitest';
import { CANONICAL_ORIGIN, canonicalUrl } from './canonical';
import {
  buildBreadcrumbListSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildWebSiteSchema,
} from './json-ld';

describe('canonicalUrl', () => {
  it('returns origin with no trailing slash for root', () => {
    expect(canonicalUrl('/')).toBe(CANONICAL_ORIGIN);
  });

  it('appends path for non-root', () => {
    expect(canonicalUrl('/pricing')).toBe(`${CANONICAL_ORIGIN}/pricing`);
    expect(canonicalUrl('/legal/disclaimer')).toBe(`${CANONICAL_ORIGIN}/legal/disclaimer`);
  });

  it('throws on path without leading slash', () => {
    expect(() => canonicalUrl('pricing')).toThrow(/must start with "\/"/);
  });
});

describe('buildOrganizationSchema', () => {
  it('emits required Organization fields', () => {
    const schema = buildOrganizationSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('Provedo');
    expect(schema.legalName).toBe('Provedo');
    expect(schema.url).toBe(CANONICAL_ORIGIN);
    expect(schema.description.length).toBeGreaterThan(0);
  });
});

describe('buildWebSiteSchema', () => {
  it('emits required WebSite fields with publisher', () => {
    const schema = buildWebSiteSchema();
    expect(schema['@type']).toBe('WebSite');
    expect(schema.url).toBe(CANONICAL_ORIGIN);
    expect(schema.publisher['@type']).toBe('Organization');
    expect(schema.publisher.name).toBe('Provedo');
  });
});

describe('buildSoftwareApplicationSchema', () => {
  it('emits FinanceApplication category', () => {
    const schema = buildSoftwareApplicationSchema();
    expect(schema['@type']).toBe('SoftwareApplication');
    expect(schema.applicationCategory).toBe('FinanceApplication');
    expect(schema.operatingSystem).toBe('Web');
  });
});

describe('buildBreadcrumbListSchema', () => {
  it('1-indexes positions and resolves canonical URLs', () => {
    const schema = buildBreadcrumbListSchema([
      { name: 'Home', path: '/' },
      { name: 'Pricing', path: '/pricing' },
    ]);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: CANONICAL_ORIGIN,
    });
    expect(schema.itemListElement[1]?.position).toBe(2);
    expect(schema.itemListElement[1]?.item).toBe(`${CANONICAL_ORIGIN}/pricing`);
  });

  it('throws when called with empty list', () => {
    expect(() => buildBreadcrumbListSchema([])).toThrow(/at least one item/);
  });
});

describe('buildFAQPageSchema', () => {
  it('shapes Q+A entries as Question/Answer pairs', () => {
    const schema = buildFAQPageSchema([
      { question: 'Is Provedo a broker?', answer: 'No. Provedo is read-only.' },
      { question: 'Is Provedo an advisor?', answer: 'No. Provedo describes what it sees.' },
    ]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'Is Provedo a broker?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Provedo is read-only.',
      },
    });
  });

  it('throws when called with empty list', () => {
    expect(() => buildFAQPageSchema([])).toThrow(/at least one Q\+A/);
  });
});
