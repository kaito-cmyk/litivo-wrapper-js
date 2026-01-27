import type { Page } from 'playwright';
import { AuthenticatedPage } from './bases/authenticated.js';
import { SideBar } from './components/sideBar.js';

export class DashboardPage extends AuthenticatedPage {
    protected readonly url: string = 'https://www.litivo.com/dashboard';
    public readonly sideBar: SideBar;

    public constructor(page: Page) {
        super(page);
        this.sideBar = new SideBar(page);
    }
}