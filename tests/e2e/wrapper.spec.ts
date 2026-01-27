import { expect, test } from './fixtures/wrapper.fixture.js';

/** wrapper tests */
test.describe('Wrapper Tests', () => {
  test('test wrapper - login and navigate', async ({ litivo, page }: any) => {
    // Verificar que estamos en el dashboard después del login
    expect(page.url()).toContain('litivo.com/dashboard');
    
    // Esperar 5 segundos para ver el dashboard
    expect(await litivo.waitForTimeout(5_000)).toBeUndefined();
  });
});
