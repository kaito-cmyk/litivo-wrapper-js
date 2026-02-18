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

  /** 
   * Lists all available options for a given input.
   * Opens the dropdown and returns an array of all option values.
   * 
   * @param nzSelect - The select input locator
   * @returns Array of available option titles
   * 
   * @example
   * const departments = await this.getInputOptions(this.departmentInput);
   * console.log('Available departments:', departments);
   */
  protected async getInputOptions(nzSelect: Locator): Promise<string[]> {
    const input: Locator = nzSelect.locator('input');
    
    // Open dropdown
    await nzSelect.click();
    await this.page.waitForTimeout(500); // Wait for dropdown to open
    
    // Wait for options to be visible
    await this.page.locator('nz-option-item').first().waitFor({ 
      state: 'visible', 
      timeout: 5000 
    }).catch(() => {
      throw new Error('Could not load input options. The dropdown may be empty or did not open.');
    });
    
    // Get all option elements
    const option = this.page.locator('nz-option-item');
    const count = await option.count();
    // using option.all
      const titles = await this.page.locator('select option')
        .evaluateAll(options => options.map(o => o.getAttribute('title')));
      console.log('evaluateAll executed:', titles);

    
    const optionTitle: string[] = [];
    for (let i = 0; i < count; i++) {
      const title = await option.nth(i).getAttribute('title');
      if (title) {
        optionTitle.push(title);
      }
    }
    
    // Close dropdown by clicking elsewhere
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
    
    return optionTitle;
  }

  /** Fills the input with the provided value selecting the first option. 
   * If exact match is not found, tries to find a partial match.
   */
  protected async fillInput(nzSelect: Locator, value: string): Promise<void> {
    const input: Locator = nzSelect.locator('input');
    await nzSelect.click();
    // Wait for the input inside the nz-select to become visible and enabled
    await input.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
      throw new Error('Select input did not become visible after opening the dropdown.');
    });

    // Wait for any options to appear (especially important for dependent dropdowns like city after department)
    try {
      await this.page.locator('nz-option-item').first().waitFor({ 
        state: 'visible', 
        timeout: 10000 
      });
    } catch {
      throw new Error('Could not load input options. The dropdown may be empty.');
    }

    // Get ALL available options BEFORE filtering (for error messages)
    // If the page/context/browser was closed, throw a clear error instead of calling Playwright timers.
    if (this.page.isClosed && this.page.isClosed()) {
      throw new Error('The page, context or browser was closed before reading available options.');
    }
    await this.page.waitForTimeout(500);
    if (this.page.isClosed && this.page.isClosed()) {
      throw new Error('The page, context or browser was closed before reading available options.');
    }
    const allOptionsLocator = this.page.locator('nz-option-item');
    const totalCount = await allOptionsLocator.count().catch(() => 0);
    const allAvailableOptions: string[] = [];

    for (let i = 0; i < Math.min(totalCount, 50); i++) { // Limit to 50 options
      const title = await allOptionsLocator.nth(i).getAttribute('title').catch(() => null);
      if (title) {
        allAvailableOptions.push(title);
      }
    }

    // ALWAYS show available options
    console.log(`\nInput has ${allAvailableOptions.length} available options:`);
    allAvailableOptions.forEach((option, index) => {
      console.log(`  ${index + 1}. ${option}`);
    });
    console.log(`Searching for: "${value}"\n`);

    // Now filter by typing the value
    try {
      if (this.page.isClosed && this.page.isClosed()) {
        throw new Error('The page was closed before filling the input.');
      }
      // Set the input value directly in the DOM and dispatch an input event
      await input.evaluate((el, v) => {
        (el as HTMLInputElement).value = v as string;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, value);
    } catch (err) {
      if (this.page.isClosed && this.page.isClosed()) {
        throw new Error('The page, context or browser was closed while attempting to fill the input.');
      }
      throw err;
    }

    // Wait for at least one option to appear after filtering (faster than fixed timeout)
    try {
      await this.page.locator('nz-option-item').first().waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      // If no options appear quickly, do a short fallback wait before continuing to the matching logic
      await this.page.waitForTimeout(500);
    }

    // Try to find the option with the exact title
    let optionDiv: Locator = this.getOptionDiv(value);
    
    try {
      await optionDiv.waitFor({ state: 'visible', timeout: 3000 });
      await optionDiv.click();
      await this.page.waitForTimeout(1000);
      return; // Success with exact match
    } catch (error) {
      // Exact match not found, try partial match
      console.log(`Exact match not found for "${value}", trying partial match...`);
    }
    
    // Try partial match - get currently visible options after filter
    const options = this.page.locator('nz-option-item');
    const count = await options.count().catch(() => 0);
    let matchedIndex = -1;
    
    // Normalize the search value (remove punctuation, extra spaces)
    const normalizedValue = value.replace(/[,\.]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    
    // Check visible options first (after filter)
    for (let i = 0; i < count; i++) {
      const title = await options.nth(i).getAttribute('title').catch(() => null);
      if (title) {
        const normalizedTitle = title.replace(/[,\.]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
        if (normalizedTitle === normalizedValue || normalizedTitle.includes(normalizedValue)) {
          matchedIndex = i;
          break;
        }
      }
    }
    
    // If we found a partial match in visible options, click it
    if (matchedIndex >= 0) {
      const matchedOption = await options.nth(matchedIndex).getAttribute('title');
      console.log(`Found partial match: "${matchedOption}" for "${value}"`);
      await options.nth(matchedIndex).click();
      await this.page.waitForTimeout(1000);
      return;
    }
    
    // Not found in filtered results, try in ALL options
    let bestMatch = -1;
    for (let i = 0; i < allAvailableOptions.length; i++) {
      const title = allAvailableOptions[i];
      if (!title) continue;
      const normalizedTitle = title.replace(/[,\.]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (normalizedTitle === normalizedValue || normalizedTitle.includes(normalizedValue)) {
        bestMatch = i;
        break;
      }
    }

    if (bestMatch >= 0 && allAvailableOptions[bestMatch]) {
      // Found in all options, need to click without filter
      console.log(`Found in all options: "${allAvailableOptions[bestMatch]}". Clicking without filter...`);
      await input.clear();
      await this.page.waitForTimeout(500);
      const targetOption = this.getOptionDiv(allAvailableOptions[bestMatch]!);
      await targetOption.click();
      await this.page.waitForTimeout(1000);
      return;
    }

    // No match found at all
    const optionsList = allAvailableOptions.length > 0
      ? `\n\nAvailable options (${allAvailableOptions.length}):\n` +
        allAvailableOptions.map((opt, idx) => `  ${idx + 1}. ${opt}`).join('\n')
      : '\n\nCould not read available options.';

    throw new Error(
      `Option "${value}" was not found in the input.${optionsList}`
    );
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
    await this.page.waitForTimeout(500); // Wait for dropdown to open
    
    const optionDiv: Locator = this.getOptionDiv(value);
    
    try {
      await optionDiv.waitFor({ state: 'visible', timeout: 5000 });
      await optionDiv.click();
    } catch (error) {
      // Get available options to show in error message
      const availableOptions = await this.getInputOptions(nzSelect).catch(() => []);
      throw new Error(
        `Option "${value}" was not found in the select. ` +
        (availableOptions.length > 0
          ? `Available options: ${availableOptions.join(', ')}`
          : 'Could not read available options.')
      );
    }
    
    await this.page.waitForTimeout(500);
  }

  protected async selectDescriptedOption(input: Locator, value: string): Promise<void> {
    await input.click();
    await this.page.waitForTimeout(500); // Wait for dropdown to open
    
    const optionDiv: Locator = this.page.locator(strongOptionDivSelector, { hasText: value });
    
    try {
      await optionDiv.waitFor({ state: 'visible', timeout: 5000 });
      await optionDiv.click();
    } catch (error) {
      // Try to get available options
      const allOptions = this.page.locator(strongOptionDivSelector);
      const count = await allOptions.count();
      const availableOptions: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const text = await allOptions.nth(i).textContent();
        if (text) {
          availableOptions.push(text.trim());
        }
      }
      
      throw new Error(
        `Option "${value}" was not found in the select. ` +
        (availableOptions.length > 0
          ? `Available options: ${availableOptions.join(', ')}`
          : 'Could not read available options.')
      );
    }
    
    await this.page.waitForTimeout(500);
  }

  abstract send(...params: T): Promise<void>;
}

export default BaseSection;
