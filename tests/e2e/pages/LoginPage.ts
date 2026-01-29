<<<<<<< HEAD
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
=======
import { Page } from '@playwright/test';
>>>>>>> 958bfebc40243426ca1d1f80d0bd5cd0c946d0f3

export class LoginPage {
  private page: Page;
  
  // Selectores
  private emailInput = 'input[name="email"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button[type="submit"]';
  
  constructor(page: Page) {
    this.page = page;
  }
  
<<<<<<< HEAD
  async goto(baseUrl?: string) {
    const url = baseUrl ? `${baseUrl}/login` : '/login';
    await this.page.goto(url);
=======
  async goto() {
    await this.page.goto('/login');
>>>>>>> 958bfebc40243426ca1d1f80d0bd5cd0c946d0f3
  }
  
  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
<<<<<<< HEAD
    await this.page.waitForURL('**/dashboard'); // Ajusta la URL esperada después del login
  }
  
  async isLoggedIn() {
    // Verifica si login fue exitoso (ajusta según tu app)
    await expect(this.page).not.toHaveURL('**/login');
=======
>>>>>>> 958bfebc40243426ca1d1f80d0bd5cd0c946d0f3
  }
}
