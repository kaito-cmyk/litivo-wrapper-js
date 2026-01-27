import type { Locator, Page } from '@playwright/test';

export class SideBar {
    private readonly insolvencyMenu: Locator;
    private readonly createRequestBtn: Locator;

    public constructor(private readonly page: Page) {
        // Seleccionamos el menú de insolvencia y el botón de crear
        this.insolvencyMenu = page.getByText('Sección de Insolvencia');
        this.createRequestBtn = page.locator('app-card-navigation').filter({ hasText: 'Crear Solicitud' }).first();
    }

    async goToCreateRequest() {
        await this.insolvencyMenu.click();
        await this.createRequestBtn.click();
    }
}