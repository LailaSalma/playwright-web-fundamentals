import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test.describe('file upload and download exercise', () => {
    test('uploads file from disk and downloads it', async ({ page }) => {
        const fileName = `upload-exercise-${Date.now()}.csv`;
        const fileContent = await readFile('tests/fixtures/upload-exercise.csv', 'utf-8');

        await page.goto('https://the-internet.herokuapp.com/upload');
        await page.locator('#file-upload').setInputFiles({
            name: fileName,
            mimeType: 'text/csv',
            buffer: Buffer.from(fileContent),
        });

        await page.getByRole('button', { name: 'Upload' }).click();

        await expect(page.getByRole('heading', { name: 'File Uploaded!'})).toBeVisible();
        await expect(page.locator('#uploaded-files')).toHaveText(fileName);

        await page.goto('https://the-internet.herokuapp.com/download');
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('link', { name: fileName, exact: true}).click();
        const download =  await downloadPromise;
        
        expect(download.suggestedFilename()).toBe(fileName);

        const savedPath = test.info().outputPath(fileName);
        await download.saveAs(savedPath);
        expect(await readFile(savedPath, 'utf-8')).toBe(fileContent);
    });
});