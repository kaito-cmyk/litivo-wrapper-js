import dotenv from 'dotenv';
dotenv.config();

import path from 'path';

// Siempre busca el .env en la raíz del proyecto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e', // Folder where Playwright will look for tests
  testMatch: '**/*.spec.ts', // Only files that end with .spec.ts will be treated as tests

  // Allows all tests to run in parallel (faster execution)
  // Good only if tests do not depend on each other
  fullyParallel: true,
  
  use: {
    headless: false, // Mostrar navegador en pantalla
    baseURL: 'http://localhost:3000', // Ajusta según tu aplicación
  },

  // If running in CI, fail the build if test.only is found
  // Prevents accidentally running only one test in production
  forbidOnly: !!process.env.CI,

  // Retry failed tests only in CI
  // CI environments can be slow or unstable
  retries: process.env.CI ? 2 : 0,

  // Limit workers in CI to avoid instability
  // Locally, Playwright will decide automatically
  workers: process.env.CI ? 1 : undefined,

  // Generate an HTML report after tests finish
  // You can open it with: npx playwright show-report
  reporter: 'html',
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  globalSetup: './playwright.global-setup.ts',
});

