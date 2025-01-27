import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer';
import Handlebars from 'handlebars';
import inlineCss from 'inline-css';
import { CallbackFunction, FileInput } from './types';

export interface PdfOptions extends PDFOptions {}

export const generatePdf = async (
  file: FileInput,
  options: PDFOptions,
  callback?: CallbackFunction
): Promise<Buffer> => {

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  });
  
  const page: Page = await browser.newPage();

  if (file.content) {
    const data = await inlineCss(file.content, { url: "/" });
    
    const template = Handlebars.compile(data, { strict: true });
    const result = template(data);
    const html = result;

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });
  } else if (file.url) {
    await page.goto(file.url, {
      waitUntil: ['load', 'networkidle0'],
    });
  } else {
    throw new Error('Either content or url must be provided');
  }

  try {
    const pdfBuffer = await page.pdf(options);
    await browser.close();
    const result = Buffer.from(Object.values(pdfBuffer));
    
    if (callback) {
      callback(null, result);
    }
    return result;
  } catch (err) {
    if (callback) {
      callback(err as Error);
      return Buffer.from([]);
    }
    throw err;
  }
};