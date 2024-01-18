/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * QR Service
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */

var QRCode = require("qrcode");
var fs = require("fs");
var html_to_pdf = require("html-pdf-node");

module.exports = {
  generateQRImage(targetUrl) {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(
        targetUrl,
        {
          errorCorrectionLevel: "H",
        },
        function (err, dataUrl) {
          if (err) reject(err);
          resolve(dataUrl);
        }
      );
    });
  },

  readFileContent(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  replaceVariables(str, variableObj) {
    Object.entries(variableObj).forEach(([variable, value]) => {
      str = str.replace(new RegExp(`{{{${variable}}}}`, "g"), value);
    });
    return str;
  },

  generatePDF(content) {
    return new Promise((resolve, reject) => {
      html_to_pdf.generatePdf({ content }, { format: "A4" }, (err, buffer) => {
        if (err) reject(err);
        resolve(buffer);
      });
    });
  },
};
