const path = require("path");
const puppeteer = require("puppeteer");
const ejs = require("ejs");

async function generateInvoicePDF(invoiceData) {
  const html = await ejs.renderFile(
    path.join(__dirname, "../views/invoice.ejs"),
    invoiceData,
    { async: true }
  );

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return pdfBuffer;
}

module.exports = { generateInvoicePDF };
