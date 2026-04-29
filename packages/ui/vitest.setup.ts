import '@testing-library/jest-dom/vitest';
// Register Phase α.2 chart-primitive matchers globally so chart-kind tests
// can `expect(container).toBeAccessibleChart()` without per-file imports.
import './src/charts/primitives/svg/test-utils/toBeAccessibleChart';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
