import type { Locator, Page } from 'playwright';
import { z } from 'zod';
import { strongOptionDivSelector } from '../../constants.js';
import Paged from './paged.js';

const isoDateSchema = z.iso.date();

abstract class BaseSection<T extends unknown[]> extends Paged {
  public constructor(page: Page) {
    super(page);
  }

  private getOptionDiv(title: string): Locator {
    return this.page.locator(`nz-option-item[title="${title}"]`);
  }

  /** Fills the input with the provided value selecting the first option. */
  protected async fillInput(nzSelect: Locator, value: string): Promise<void> {
    const input: Locator = nzSelect.locator('input');
    await nzSelect.click();
    await input.fill(value);
    const optionDiv: Locator = this.getOptionDiv(value);
    await optionDiv.click();
    await this.page.waitForTimeout(500); // TODO: find a better way to wait for the input to be filled.
  }

  /** date value should be in YYYY-MM-DD format. Fill in "yyyy/mm/dd" format.
   */
  protected async fillDateInput(nzDatePicker: Locator, value: string): Promise<void> {
    const input: Locator = nzDatePicker.locator('input');
    const date: string = isoDateSchema.parse(value);
    const slashedDate: string = date.replace(/-/g, '/');

    await input.click();
    await input.fill(slashedDate);
    await input.press('Tab'); // NOTE: Close calendar.
    await this.page.waitForTimeout(500); // TODO: find a better way to wait for the input to be filled.
  }

  protected async selectOption(nzSelect: Locator, value: string): Promise<void> {
    const input: Locator = nzSelect.locator('input');
    await input.click();
    const optionDiv: Locator = this.getOptionDiv(value);
    await optionDiv.click();
  }

  protected async selectDescriptedOption(input: Locator, value: string): Promise<void> {
    await input.click();
    const optionDiv: Locator = this.page.locator(strongOptionDivSelector, { hasText: value });
    await optionDiv.click();
  }

  abstract send(...params: T): Promise<void>;
}

export default BaseSection;
