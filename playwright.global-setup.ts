import type { FullConfig } from '@playwright/test';
import { openLitivo } from './scripts/open-litivo';

async function globalSetup(_config: FullConfig) {
  const shouldOpen = process.env.OPEN_LITIVO === '1' || process.env.OPEN_LITIVO === 'true';
  if (!shouldOpen) return;

  const url = process.env.LITIVO_URL;
  const exe = process.env.LITIVO_EXE;

  if (exe) {
    await openLitivo({ exePath: exe, args: url ? [url] : [] });
  } else if (url) {
    await openLitivo({ url });
  } else {
    console.warn('OPEN_LITIVO está activo pero faltan LITIVO_URL o LITIVO_EXE.');
  }
}

export default globalSetup;
