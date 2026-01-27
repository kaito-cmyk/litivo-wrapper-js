import { Page } from '@playwright/test';

export class LoginPage {
  private page: Page;
  
  // Selectores
  private emailInput = 'input[name="email"]';
  private passwordInput = 'input[name="password"]';
  private loginButton = 'button[type="submit"]';
  
  constructor(page: Page) {
    this.page = page;
  }
  
  async goto() {
    await this.page.goto('/login');
  }
  
  async login(email: string, password: string) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}
