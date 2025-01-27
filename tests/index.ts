'use strict';
import { expect } from "chai";
import fs from "fs";
import { generatePdf, generatePdfs } from "../src/index";
const file = fs.readFileSync('./tests/sample.html', 'utf-8');

describe('convert-html-to-pdf', function () {
    it('convert-html-to-pdf-with-callback', function (done) {
        generatePdf({ content: file }, { format: 'A4' }, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.be.an.instanceOf(Buffer);
            done();
        });
    });
    it('convert-html-to-pdf-with-url', function (done) {
        generatePdf({ url: 'https://www.google.com/' }, { format: 'A4' }, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.be.an.instanceOf(Buffer);
            done();
        });
    });
});
describe('convert-array-of-htmls-to-pdfs', function () {
    it('convert-html-to-pdf-with-callback', function (done) {
        generatePdfs([{ content: file }], { format: 'A4' }, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.be.an.instanceOf(Array);
            expect(result).to.not.be.undefined;
            expect(result![0]).to.be.an.instanceOf(Object);
            done();
        });
    });
    it('convert-html-to-pdf-with-url', function (done) {
        generatePdfs([{ url: 'https://www.google.com/' }], { format: 'A4' }, function (err, result) {
            expect(err).to.be.null;
            expect(result).to.be.an.instanceOf(Array);
            expect(result).to.not.be.undefined;
            expect(result![0]).to.be.an.instanceOf(Object);
            done();
        });
    });
});
//# sourceMappingURL=index.js.map