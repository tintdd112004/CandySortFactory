// Optional smoke test (needs Playwright):  npm i -D playwright && npx playwright install chromium && npm test
// Plays every level with the built-in solver bot and checks each one is winnable in both themes.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const builds = { factory: 'dist/factory.html', candy: 'dist/candy.html' };
const browser = await chromium.launch();
let failed = 0;
for (const [name, file] of Object.entries(builds)) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (e) => { console.log(`[${name}] page error: ${e.message}`); failed++; });
  await page.goto(pathToFileURL(join(process.cwd(), file)).href);
  await page.waitForTimeout(800);
  await page.click('#bStart');
  const levels = await page.evaluate(() => 10);
  for (let lv = 0; lv < levels; lv++) {
    await page.evaluate((l) => G.play(l), lv);
    const r = await page.evaluate(() => G.turbo(2500, 'seq'));   // fast headless simulation, follows the generated solution
    const ok = r.state === 'win';
    if (!ok) failed++;
    console.log(`[${name}] level ${lv + 1}: ${ok ? 'win' : 'FAIL'} (${r.totalLoaded}/${r.TOTAL} boxes)`);
  }
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
