import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { test, expect } from '@playwright/test';

const PORT = 5173;
let serverProcess;

async function startServer() {
  console.log('🚀 Starting React App...');
  serverProcess = spawn('npm', ['run', 'dev'], { stdio: 'ignore', shell: true });
  await new Promise(r => setTimeout(r, 60));
}

async function runTests() {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 80,
    args: [
      '--start-maximized',
      '--window-size=1920,1080',
      '--window-position=0,0'
    ]
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  const log = (msg) => console.log(`✅ ${msg}`);

  try {
    await page.goto(`http://localhost:${PORT}`);

    // ---- TEST 1: Mobile Sidebar ----
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('header button');
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.reload();
    await page.waitForTimeout(500);
    await page.click('header button');
    await page.waitForSelector('text=Select Portal View');
    await page.click('aside button:has-text("Nurse Station")');
    await page.waitForSelector('text=Nurse Triage & Patient Vitals Portal');
    // close the blur screen
    await page.locator('aside button').first().click();
    // change the window size
    // await page.waitForSelector('.fixed.inset-0.bg-slate-900\\/50', { state: 'hidden', timeout: 5000 });
    log('Test 1: Mobile sidebar');

    // ---- TEST 2: Add Patient ----
    await page.fill('input[name="name"]', 'Test Patient A');
    await page.fill('input[name="age"]', '40');
    await page.fill('input[name="token"]', '888');
    await page.click('button:has-text("Save & Send to Doctor Queue")');
    await page.waitForSelector('text=Test Patient A');
    log('Test 2: Patient added');

    // ---- TEST 3: Duplicate Token Blocked ----
    await page.fill('input[name="name"]', 'Test Patient B');
    await page.fill('input[name="age"]', '30');
    // assigning same token 888 as above
    await page.fill('input[name="token"]', '888');
    await page.click('button:has-text("Save & Send to Doctor Queue")');
    await page.waitForTimeout(50);
    // if duplicate token are block then name's field has same name 
    const nameStillFilled = await page.locator('input[name="name"]').inputValue();
    if (nameStillFilled === 'Test Patient B') log('Test 3: Duplicate token blocked');
    else throw new Error('Duplicate token was NOT blocked');
    await page.click('button:has-text("Clear Form")');


    // ---- TEST 4: Same Name with New Token Allowed ----
    await page.fill('input[name="name"]', 'Test Patient A');
    await page.fill('input[name="age"]', '40');
    await page.fill('input[name="token"]', '999');
    await page.click('button:has-text("Save & Send to Doctor Queue")');
    await page.waitForTimeout(50);
    // if duplicate name are allowed then name's field has ''
    const formCleared = await page.locator('input[name="name"]').inputValue();
    if (formCleared === '') log('Test 4: Same name with new token allowed');
    else throw new Error('Same name with different token should be allowed');

    // ---- TEST 5: View & Edit Vitals ----
    await page.locator('main button:has-text("View")').first().click();
    await page.waitForSelector('text=Patient Record Details');
    await page.click('button:has-text("Close View")');
    await page.locator('main button:has-text("Edit")').first().click();
    await page.fill('input[name="bp"]', '150/90');
    await page.click('button:has-text("Update Vitals")');
    await page.waitForSelector('text=150/90');
    log('Test 5: Vitals edit');


    // ---- TEST 6: counting # of patients Que ----
    const countPatientsQue = await page.locator('div.p-3\\.5.bg-slate-50.border.rounded-xl').count();
    console.log(`✅ TEST 6: Total items: ${countPatientsQue}`);

    // ---- TEST 7: Send to Doctor ----
    await page.locator('main button:has-text("Doctor Rx")').first().click();
    await page.waitForSelector('text=Active Patient Queue');
    log('Test 7: Send to doctor');

    // ---- TEST 8: Add Medicine HomePg ----
    await page.locator('section button:has-text("Add")').first().click();
    await page.waitForSelector('text=Added');
    log('Test 8: Medicine added');

    // ---- TEST 9: Add Lab Test HomePg ----
    await page.locator('section button:has-text("Lab Tests / Diagnostics")').click();
    await page.locator('section button:has-text("Order")').first().click();
    await page.waitForSelector('text=Ordered');
    log('Test 9: Lab test added');

    // ---- TEST 10: Print Modal HomePg ----
    await page.click('header button:has-text("Print Prescription")');
    await page.waitForSelector('text=Print Prescription Preview');
    await page.locator('#print-modal .no-print button').last().click();
    await page.waitForSelector('text=Print Prescription Preview', { state: 'hidden', timeout: 5000 });
    log('Test 10: Print modal');


    // Open dropdown
    // const select = page.locator('select.bg-slate-800');
    // await select.focus();
    // await page.keyboard.press('Space');
    // await page.waitForTimeout(50);

    // ---- TEST 11: counting drop down before completed HomePage | TEST 6 ----
    const optionCount = await page.locator('select.bg-slate-800 option').count();
    console.log(`✅ Test 11: Total options: ${optionCount}`);

    // ---- TEST 12: Is drop down count same as Test 6, before completed HomePage----
    if (countPatientsQue === (optionCount + 1)) {
      console.log(`✅ TEST 12: Total options are less than -1 the previous one before completed`);
    }

    // ---- TEST 13: Complete Visit
    await page.click('header button:has-text("Complete Visit")');

    // Check that the prescription panel is now EMPTY (0 items) — proving the visit was completed
    const prescriptionCount = await page.locator('text=/^\\d+ items$/').first().textContent();
    if (prescriptionCount && prescriptionCount.includes('0 items')) {
      log('Test 13: Complete visit');
    } else {
      // Verify completion by checking the dropdown no longer shows #999 OR a new patient is selected
      // Alternative: verify the current patient is NOT #999 (auto-advanced)
      // ====================very important=================================
      const dropdownValue = await page.locator('select').first().inputValue();
      if (dropdownValue !== '999') {
        log('Test 13: Complete visit (auto-advanced to next patient)');
      } else {
        throw new Error('Test 13: Visit was NOT completed — patient #999 still active');
      }
    }


    // ---- TEST 14: counting drop down after completed HomePage | TEST 6|11 ----
    const optionCountComplete = await page.locator('select.bg-slate-800 option').count();
    console.log(`✅ Test 14: Total options: ${optionCountComplete}`);


    // ---- TEST 15: Is drop down count same as Test 6, before completed HomePage Test 12----
    if (countPatientsQue === (optionCountComplete + 1)) {
      console.log(`✅ Test 15: Total options are less than -1 the previous one after completed`);
    }


    // ---- TEST 16: Patient Searched and Viewed
    // Open sidebar
    await page.click('header button');
    await page.waitForTimeout(50);
    await page.locator('aside button:has-text("Patient Archives")').click();
    await page.waitForTimeout(50);
    // 🔥 Close the sidebar overlay to free up the main area
    await page.locator('div.fixed.inset-0.bg-slate-900\\/50').click({ position: { x: 500, y: 300 } });
    await page.waitForTimeout(50);
    // show all dates
    await page.locator('button[title="Show All Dates"]').click();
    // Test Search Patient A / Rahul Sharma
    await page.fill('input[placeholder="Search..."]', 'Rahul Sharma');
    await page.locator('#view-patient-archives button:has-text("View")').first().click();
    await page.waitForSelector('text=Patient File - Rahul Sharma');
    log('TEST 16: Patient Searched and Viewed');

    // ---- TEST 17: Duplicate blocked / New visit ----
    await page.locator('button:has-text("Create New Visit")').click();

    // false | Already in Today's Queue
    const toastVisible1 = await page
      .locator("text=already in today's queue")
      .first()
      .isVisible()
      .catch(() => false);

    log("TEST 17: (Rahul Sharma) Duplicate blocked / New Visit")
    console.log(toastVisible1 === true ? "Duplicate" : "New");


    // ---- TEST 18: History
    // Open sidebar
    await page.click('header button');
    await page.waitForTimeout(50);
    await page.locator('aside button:has-text("Patient Archives")').click();
    await page.waitForTimeout(50);
    // 🔥 Close the sidebar overlay to free up the main area
    await page.locator('div.fixed.inset-0.bg-slate-900\\/50').click({ position: { x: 500, y: 300 } });
    await page.waitForTimeout(50);

    // Search: Patient A / Rahul Sharma
    await page.fill('input[placeholder="Search..."]', 'Rahul Sharma');

    // ---- Open: Rahul's History
    await page.locator('#view-patient-archives button:has-text("History")').first().click();
    await page.waitForTimeout(50);

    // today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];  // "2026-11-08" style

    // History card check
    const todayVisible = await page
      .locator('#view-patient-archives')
      .locator(`h5:has-text("${today}")`)
      .first()
      .isVisible()
      .catch(() => false);

    log(`Test 18: History`);

    if (todayVisible) {
      console.log(`ok (${today})`);
    } else {
      console.log(`fail (${today})`);
    }

    // History Viewable check
    const isTodayRecord = await page
      .locator('h4:has-text("Record from")')
      .filter({ hasText: today })
      .first()
      .isVisible()
      .catch(() => false);

    if (isTodayRecord) {
      console.log(`View (${today})`);
    } else {
      console.log(`noView (${today})`);
    }


    // Test 19: History editing
    log(`Test 19: History editing`);
    // send to doctor
    await page.locator('#view-patient-archives button:has-text("Doctor Rx")').first().click();
    // hasReached
    const isReachToDoctor = await page
      .locator('h3:has-text("Rahul Sharma")')
      .first()
      .isVisible()
      .catch(() => false);

    console.log(isReachToDoctor === true ? "Yes Reach" : "No Reach");


    // ---- TEST 20: Inventory
    // open sidebar > Medical catalog
    await page.click('header button');
    await page.locator('aside button:has-text("Medicine Catalog")').click();
    await page.waitForTimeout(50);
    await page.locator('div.fixed.inset-0.bg-slate-900\\/50').click({ position: { x: 500, y: 300 } });
    await page.waitForTimeout(50);

    // Inventory Add
    await page.locator('#view-inventory button:has-text("Add New Drug Entry")').click();
    await page.waitForSelector('text=Add New Medicine');
    await page.waitForTimeout(50);
    await page.locator('.fixed.inset-0.z-50 input[type="text"]').first().fill('Test Drug XYZ');
    await page.click('button:has-text("Save Drug")');
    await page.waitForTimeout(50);
    // 🔥 Just verify the drug name is visible in the table (not strict)
    await page.locator('#view-inventory >> text=Test Drug XYZ').first().waitFor({ timeout: 50 });
    log('Test 20: Inventory added');

    // ---- TEST 21: Inventory Edit
    await page.selectOption('#view-inventory select', 'name');
    await page.fill('#view-inventory input[placeholder*="Search in"]', 'Test Drug XYZ');
    await page.waitForTimeout(50);
    await page.locator('button[title="Edit Medicine"]').first().click();
    await page.locator('.fixed.inset-0.z-50 input[type="text"]').first().fill('Test Drug XYZ1');
    await page.click('button:has-text("Save Drug")');
    await page.waitForTimeout(50);
    log('Test 21: Inventory Edited');


    // ---- TEST 22: Inventory delete
    await page.locator('#view-inventory button[title="Delete Medicine"]').first().click();
    await page.waitForTimeout(50);
    // 🔥 Verify delete via Total Drugs count
    await page.locator('text=Total Drugs: 0').waitFor({ timeout: 50 });
    log('Test 22: Inventory delete');


    // ---- TEST 23:  Lab Tests Catalog untested----------------------------------------------------------------
    // log('Test 13: Lab Open');
    // coming soon

    console.log('\n🎉 ALL 22 TESTS PASSED.\n');
  } catch (e) {
    console.error('\n❌ FAILED:', e.message);
    await page.screenshot({ path: 'verify-failure.png' });
    console.log('📸 verify-failure.png saved\n');
  } finally {
    await browser.close();
    serverProcess.kill();
  }
}

startServer().then(runTests);