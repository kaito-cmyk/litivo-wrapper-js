import type { Page } from 'playwright';
import { WRAPPER_URL } from '../constants.js';
import { AuthenticatedPage } from './bases/authenticated.js';

export class DashboardPage extends AuthenticatedPage {
  protected readonly url: URL = new URL('/dashboard', WRAPPER_URL);

  public constructor(page: Page) {
    super(page);
  }
}
