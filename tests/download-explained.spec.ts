import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('download, step by step with printed values', async ({ page }) => {
  const fileName = `explained-${Date.now()}.txt`;
  const fileContent = 'Step by step content';

  // Create the file on the server through the upload form
  await page.goto('https://the-internet.herokuapp.com/upload');
  await page.locator('#file-upload').setInputFiles({
    name: fileName,
    mimeType: 'text/plain',
    buffer: Buffer.from(fileContent),
  });
  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.locator('#uploaded-files')).toHaveText(fileName);

  // Order the parcel: listen first, then click
  await page.goto('https://the-internet.herokuapp.com/download');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: fileName, exact: true }).click();
  const download = await downloadPromise;

  // A: the label on the delivery slip (written by the server)
  const nameFromServer = download.suggestedFilename();
  console.log('A. name from server :', nameFromServer);
  expect(nameFromServer).toBe(fileName);

  // A2: where the parcel waits in the temporary warehouse (random name)
  console.log('A2. temp warehouse  :', await download.path());

  // B: choose the shelf (only an address, nothing written yet)
  const savedPath = test.info().outputPath(fileName);
  console.log('B. shelf address    :', savedPath);

  // C: copy the parcel to the shelf
  await download.saveAs(savedPath);
  console.log('C. saved');

  // D: open it and read the letter
  const savedContent = await readFile(savedPath, 'utf-8');
  console.log('D. text inside      :', savedContent);
  expect(savedContent).toBe(fileContent);
});