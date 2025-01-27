import puppeteer, { Browser, Page, PDFOptions } from 'puppeteer';
import Handlebars from 'handlebars';
import inlineCss from 'inline-css';
import { CallbackFunction, FileInput, PdfOutput } from './types';

export interface PdfOptions extends PDFOptions {}

export const generatePdf = async (
  file: FileInput,
  options: PdfOptions,
  callback?: CallbackFunction
): Promise<Buffer> => {

  const browser: Browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });
  
  const page: Page = await browser.newPage();

  if (file.content) {
    const data = await inlineCss(file.content, { url: "/" });
    console.log("Compiling the template with handlebars");
    
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
      return Buffer.from([]); // Return empty buffer when using callback
    }
    throw err;
  }
};

export const generatePdfs = async (
  files: FileInput[],
  options: PdfOptions,
  callback?: CallbackFunction
): Promise<PdfOutput[]> => {

  const browser: Browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]
  });

  const pdfs: PdfOutput[] = [];
  const page: Page = await browser.newPage();

  try {
    for (const file of files) {
      if (file.content) {
        const data = await inlineCss(file.content, { url: "/" });
        console.log("Compiling the template with handlebars");
        
        const template = Handlebars.compile(data, { strict: true });
        const result = template(data);
        const html = result;
        
        await page.setContent(html, {
          waitUntil: 'networkidle0',
        });
      } else if (file.url) {
        await page.goto(file.url, {
          waitUntil: 'networkidle0',
        });
      } else {
        throw new Error('Either content or url must be provided');
      }

      const pdfBuffer = await page.pdf(options);
      const pdfObj: PdfOutput = {
        ...file,
        buffer: Buffer.from(Object.values(pdfBuffer))
      };
      delete pdfObj.content;
      pdfs.push(pdfObj);
    }

    await browser.close();
    
    if (callback) {
      callback(null, pdfs);
    }
    return pdfs;
  } catch (err) {
    if (callback) {
      callback(err as Error);
      return []; // Return empty array when using callback
    }
    throw err;
  }
};