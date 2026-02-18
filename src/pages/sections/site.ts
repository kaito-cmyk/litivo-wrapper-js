import type { Locator, Page } from 'playwright';
import { getInputSelector } from '../../helpers.js';
import type { SiteType } from '../../models/site.js';
import BaseSection from '../bases/section.js';

class SiteSection extends BaseSection<[SiteType]> {
  private readonly departmentInput: Locator;
  private readonly cityInput: Locator;
  private readonly sponsorEntityInput: Locator;
  private readonly branchCenterInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.departmentInput = page.locator(getInputSelector('departamento'));
    this.cityInput = page.locator(getInputSelector('ciudad'));
    this.sponsorEntityInput = page.locator(getInputSelector('entidad'));
    this.branchCenterInput = page.locator(getInputSelector('sede'));
    this.submitButton = page.locator('button.btn-guardar:not([disabled])');
  }

  public async send(site: SiteType): Promise<void> {
    // TODO: Check if is it possible to optimice by creating a custom object or doing a for loop.
    await this.fillInput(this.departmentInput, site.department);
    
    // Wait for city dropdown to be ready (not disabled) after department selection
    const cityInputElement = this.cityInput.locator('input');
    await cityInputElement.waitFor({ state: 'attached', timeout: 10000 });
    
    // Wait for the input to become enabled (in case it was disabled)
    await this.page.waitForFunction(
      (selector) => {
        const input = document.querySelector(selector);
        return input && !input.hasAttribute('disabled');
      },
      'nz-select[formcontrolname="ciudad"] input',
      { timeout: 10000 }
    );
    
    // Additional wait for options to load
    await this.page.waitForTimeout(1500);
    
    await this.fillInput(this.cityInput, site.city);
    await this.fillInput(this.sponsorEntityInput, site.sponsorEntity);
    await this.fillInput(this.branchCenterInput, site.branchCenter);
    // Wait for potential global spinner/overlay that may intercept clicks
    const spinner = this.page.locator('.ant-spin-container');
    const spinnerCount = await spinner.count().catch(() => 0);
    if (spinnerCount > 0) {
      try {
        await spinner.first().waitFor({ state: 'detached', timeout: 10000 });
      } catch {
        // if it doesn't detach, try waiting until it's not visible as a fallback
        await spinner.first().waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
      }
    }

    await this.submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.submitButton.click();
    await this.branchCenterInput.waitFor({ state: 'detached' });
  }
}

export default SiteSection;
