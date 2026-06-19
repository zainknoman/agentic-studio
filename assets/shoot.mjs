import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
await page.goto('file://' + join(here, 'og-card.html').replace(/\\/g, '/'));
await page.waitForTimeout(900); // fonts
const el = await page.$('#card');
await el.screenshot({ path: join(here, 'og-card.png') });
await browser.close();
console.log('wrote og-card.png');
