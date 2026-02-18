import { insolvency } from './config/data.js';
// NOTE: commented "import { expect, test } from './fixtures/wrapper.fixture.js';" because expect is not needed yet.
import type Litivo from '../../src/wrapper.js';
import { test } from './fixtures/wrapper.fixture.js';

test.describe('Wrapper Tests', () => {
  test('Test insolvency', async ({ litivo }: { litivo: Litivo }) => {
    await litivo.createInsolvency(insolvency);
    await litivo.waitforTimeout(500); // Breakpoint line();
  });
});
