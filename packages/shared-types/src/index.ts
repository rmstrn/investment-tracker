// Re-export generated OpenAPI types so consumers can do:
//   import type { components, paths, operations } from "@investment-tracker/shared-types";
//   type Account = components["schemas"]["Account"];

export type { components, paths, operations, webhooks } from './generated/openapi.js';

// Convenience aliases for the most-used schemas. Generated types are the
// source of truth; these aliases only exist to shorten call sites.
import type { components } from './generated/openapi.js';

export type Account = components['schemas']['Account'];
export type Transaction = components['schemas']['Transaction'];
export type Position = components['schemas']['Position'];
export type PortfolioSnapshot = components['schemas']['PortfolioSnapshot'];
export type Insight = components['schemas']['Insight'];
export type AIMessage = components['schemas']['AIMessage'];
export type AIMessageContent = components['schemas']['AIMessageContent'];
export type AIChatStreamEvent = components['schemas']['AIChatStreamEvent'];
export type ErrorEnvelope = components['schemas']['ErrorEnvelope'];
export type PaginationMeta = components['schemas']['PaginationMeta'];
export type User = components['schemas']['User'];
export type Subscription = components['schemas']['Subscription'];

// Chart payload schemas (Zod source-of-truth for AI-emitted charts).
// See `./charts` subpath export for the canonical import path.
export * from './charts.js';
