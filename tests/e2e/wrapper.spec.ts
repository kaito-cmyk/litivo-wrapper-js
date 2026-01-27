import { expect, test } from './fixtures/wrapper.fixture.js';

/** wrapper tests */
test.describe('Wrapper Tests', () => {
  test('test wrapper', async ({ litivo }: any) => {
    expect(await litivo.waitForTimeout(5_000)).toBeUndefined();
  });
});
