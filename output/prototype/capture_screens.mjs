import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir1 = path.join(__dirname, 'res_img');
const targetDir2 = path.join(__dirname, '..', 'res_img');

if (!fs.existsSync(targetDir1)) fs.mkdirSync(targetDir1, { recursive: true });
if (!fs.existsSync(targetDir2)) fs.mkdirSync(targetDir2, { recursive: true });

async function saveScreenshot(page, filename) {
  const filePath1 = path.join(targetDir1, filename);
  const filePath2 = path.join(targetDir2, filename);
  await page.screenshot({ path: filePath1, fullPage: true });
  fs.copyFileSync(filePath1, filePath2);
  console.log(`Captured: ${filename}`);
}

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const navButtons = page.locator('nav button');

  // 1. Overview Screen
  await navButtons.nth(0).click();
  await page.waitForTimeout(400);
  await saveScreenshot(page, '01_overview.png');

  // 2. Ticket Screen - Initial
  await navButtons.nth(1).click();
  await page.waitForTimeout(400);
  await saveScreenshot(page, '02_ticket_initial.png');

  // 2. Ticket Screen - Issued
  const issueBtn = page.locator('button:has-text("PRESS TO RECEIVE CARD")');
  if (await issueBtn.count() > 0) {
    await issueBtn.click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, '02_ticket_issued.png');
  }

  // 3. Floor Map Screen
  await navButtons.nth(2).click();
  await page.waitForTimeout(400);
  await saveScreenshot(page, '03_floormap_b2.png');

  // 4. Check Position Screen - Waiting
  await navButtons.nth(3).click();
  await page.waitForTimeout(400);
  await saveScreenshot(page, '04_checkposition_waiting.png');

  // 4. Check Position Screen - Result
  const checkBtn = page.locator('button:has-text("QUẸT THẺ P-8821")');
  if (await checkBtn.count() > 0) {
    await checkBtn.click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, '04_checkposition_result.png');
  }

  // 5. Payment Screen - Step 1: Tap card
  await navButtons.nth(4).click();
  await page.waitForTimeout(400);
  await saveScreenshot(page, '05_payment_step1_tapcard.png');

  // 5. Payment Screen - Step 2: Pay QR
  const tapCardBtn = page.locator('button:has-text("QUẸT THẺ THU PHÍ")').first();
  if (await tapCardBtn.count() > 0) {
    await tapCardBtn.click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, '05_payment_step2_qr.png');
  }

  // 5. Payment Screen - Step 2: Pay POS
  const posTab = page.locator('button:has-text("Chạm thẻ POS")');
  if (await posTab.count() > 0) {
    await posTab.click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, '05_payment_step2_pos.png');
  }

  // 5. Payment Screen - Step 3: Success & Barrier open
  const confirmPayBtn = page.locator('button:has-text("XÁC NHẬN THANH TOÁN")');
  if (await confirmPayBtn.count() > 0) {
    await confirmPayBtn.click();
    await page.waitForTimeout(400);
    await saveScreenshot(page, '05_payment_step3_success.png');
  }

  await browser.close();
  console.log('All prototype screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
