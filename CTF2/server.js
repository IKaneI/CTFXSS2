const express = require('express');
const { chromium } = require('playwright');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/submit', async (req, res) => {
  let name = req.query.name;

  console.log('Received input:', name);

  if (name) {
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();

      // Intercept and handle alert dialogs
      page.on('dialog', async (dialog) => {
        console.log('Alert message:', dialog.message());
        await dialog.dismiss(); // Dismiss the alert
        res.send(`<p>Alert successfully triggered! Flag will not be revealed.</p>`);
        await browser.close();
      });

      // Use Playwright to automate testing
      await page.setContent(`
        <html>
          <body>
            <input type="text" id="name" name="name" value="${name}">
            <script>
              var yourInput = '${name}';
            </script>
          </body>
        </html>`);

      // Inject the script for evaluation
      await page.evaluate(() => {
        window.alertTriggered = false;
        const originalAlert = window.alert;
        window.alert = function() {
          window.alertTriggered = true;
          originalAlert.apply(window, arguments);
        };
      });

      // Close the browser after use
      await browser.close();
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.send(`<input type="text" id="name" name="name">\n`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

