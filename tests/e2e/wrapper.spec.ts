import { test } from '@playwright/test';
import { UserCredentials } from './config/testEnv';
import { LoginPage } from './pages/LoginPage';

test('test wrapper - login and navigate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(UserCredentials.email, UserCredentials.password);
});
