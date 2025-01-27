# @logismiko/html-pdf

Convert HTML content or web pages to PDF using Node.js and Puppeteer.

## Installation

```bash
npm install @logismiko/html-pdf
```

## Usage

```typescript
import { generatePdf, generatePdfs } from '@logismiko/html-pdf';

// Generate single PDF
const file = { content: "Welcome" };
// or
const file = { url: "https://example.com" };

const options = { format: 'A4' };

// Promise
generatePdf(file, options)
  .then(pdfBuffer => {
    console.log("PDF Buffer:-", pdfBuffer);
  });

// Callback
generatePdf(file, options, (err, pdfBuffer) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("PDF Buffer:-", pdfBuffer);
  });

// Generate multiple PDFs
const files = [
  { content: "Welcome" },
  { url: "https://example.com" }
];

generatePdfs(files, options)
  .then(pdfs => {
    console.log("PDF Buffers:-", pdfs);
  });
```

## Options

The options parameter accepts all [Puppeteer PDF options](https://pptr.dev/api/puppeteer.pdfoptions).

Common options include:

- `format`: 'A4', 'Letter', etc.
- `path`: File path to save the PDF to
- `width`: Page width
- `height`: Page height
- `printBackground`: Include background graphics
- `margin`: Page margins

## License

ISC
