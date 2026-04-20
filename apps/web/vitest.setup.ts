import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Vitest `globals: false` prevents `@testing-library/react` from registering
// its built-in `afterEach(cleanup)` — without this hook rendered trees
// accumulate across `it` blocks and `getByText` hits duplicates.
afterEach(() => {
  cleanup();
});
