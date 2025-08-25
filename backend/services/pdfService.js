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

async function generateDeliveryNotePDF(order) {
  const html = await ejs.renderFile(
    path.join(__dirname, "../views/deliveryNote.ejs"),
    { order },
    { async: true }
  );

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return pdfBuffer;
}

async function generateReceiptPDF(data) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = await ejs.renderFile(
        path.join(__dirname, "../views/receipt.ejs"),
        data,
        { async: true }
    );

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        width: "58mm",   // oder "80mm", je nach Drucker
        printBackground: true
    });

    await browser.close();
    return pdfBuffer;
}

module.exports = { generateInvoicePDF, generateReceiptPDF, generateDeliveryNotePDF };
