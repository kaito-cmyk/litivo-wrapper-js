import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';

(async () => {
  const browser: Browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
  });
  const browserContext: BrowserContext = await browser.newContext();
  const page: Page = await browserContext.newPage();
  try {
    await page.goto('http://example.com');
    await page.pause();
  } finally {
    await page.close();
    await browserContext.close();
    await browser.close();
  }
})();
