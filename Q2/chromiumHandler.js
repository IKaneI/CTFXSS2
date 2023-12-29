// chromiumHandler.js
const puppeteer = require('puppeteer');

async function handleChromium(scriptBlock) {
  const executablePath = '/usr/bin/chromium';

  const browser = await puppeteer.launch({
    executablePath,
    timeout: 30000,
  });

  const page = await browser.newPage();

  // Use page.on('dialog') to handle alerts
  let alertTriggered = false;
  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') {
      alertTriggered = true;
      await dialog.accept();
    }
  });

  await page.setContent(`<input type="text" id="name" name="name">\n${scriptBlock}`);
  await page.waitForTimeout(1000);

  // Close the browser after processing
  await browser.close();

  return alertTriggered;
}

module.exports = { handleChromium };

