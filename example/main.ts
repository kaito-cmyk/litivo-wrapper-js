import { type BrowserContext, type Page } from 'playwright';

export async function main(browserContext: BrowserContext): Promise<void> {
  const page: Page = await browserContext.newPage();
  try {
    await page.goto('http://playwright.dev');
    await page.waitForTimeout(5000); // wait for 5 seconds to see the browser
  } finally {
    await page.close();
  }
  console.log('Script completed.');
}
