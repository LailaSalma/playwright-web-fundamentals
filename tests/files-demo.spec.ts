import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.describe('file upload and download', () => {
  test('uploads a file from disk', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/upload');

    await page.locator('#file-upload').setInputFiles('tests/fixtures/upload-demo.txt');
    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.getByRole('heading', { name: 'File Uploaded!' })).toBeVisible();
    await expect(page.locator('#uploaded-files')).toHaveText('upload-demo.txt');
  });

  test('downloads a file the test uploaded itself', async ({ page }) => {
    const fileName = `download-demo-${Date.now()}.txt`;
    const fileContent = 'Round trip content';

    // Step 1: create the test data through the upload form
    await page.goto('https://the-internet.herokuapp.com/upload');
    await page.locator('#file-upload').setInputFiles({
      name: fileName,
      mimeType: 'text/plain',
      buffer: Buffer.from(fileContent),
    });
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#uploaded-files')).toHaveText(fileName);

    // Step 2: download the same file
    await page.goto('https://the-internet.herokuapp.com/download');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('link', { name: fileName, exact: true }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe(fileName);

    const savedPath = test.info().outputPath(fileName);
    await download.saveAs(savedPath);
    const savedContent = await readFile(savedPath, 'utf-8');
    expect(savedContent).toBe(fileContent);
  });
});