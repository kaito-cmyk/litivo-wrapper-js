import type { Locator, Page } from 'playwright';
import { z } from 'zod';
import { optionDivSelector, strongOptionDivSelector } from '../../constants.js';
import Paged from './paged.js';

const isoDateSchema = z.iso.date();

abstract class BaseSection<T extends unknown[]> extends Paged {
  private readonly firstOptionDiv: Locator;

  public constructor(page: Page) {
    super(page);
    const optionDiv: Locator = page.locator(optionDivSelector);
    this.firstOptionDiv = optionDiv.first();
  }

  /** Fills the input with the provided value selecting the first option. */
  protected async fillInput(input: Locator, value: string): Promise<void> {
    await input.click();
    await input.fill(value);
    this.firstOptionDiv.click();
    await this.page.waitForTimeout(500); // TODO: find a better way to wait for the input to be filled.
  }

  /** date value should be in YYYY-MM-DD format. Fill in "yyyy/mm/dd" format.
   */
  protected async fillDateInput(input: Locator, value: string): Promise<void> {
    const date: string = isoDateSchema.parse(value);
    const slashedDate: string = date.replace(/-/g, '/');

    await input.click();
    await input.fill(slashedDate);
    await input.press('Tab'); // NOTE: Close calendar.
    await this.page.waitForTimeout(500); // TODO: find a better way to wait for the input to be filled.
  }

  protected async selectOption(input: Locator, value: string): Promise<void> {
    await input.click();
    const optionDiv: Locator = this.page.locator(optionDivSelector, { hasText: value });
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
