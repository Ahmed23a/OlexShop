const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require('moment')

function createProductPDF(data, path , pdfName) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc); 
  generateInvoiceTable(doc, data);
  generateFooter(doc);

  doc.end();
  
  if (!fs.existsSync(path))
  {
    console.log({ path: path })
    fs.mkdirSync(path, { recursive: true })
  }

  doc.pipe(fs.createWriteStream(`${path}/${pdfName}`));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 80 })
    .fontSize(13)
    .fillColor("#ffaa00")
    .text("Fishy",120 , 70 )
    .fillColor("black")    
    .fontSize(14)
    .text("Today's Products", 250, 57, { align: 'center' })
    .text(`Date: ${moment(new Date()).format('Do MMMM YYYY')}`, 250,80, {
      align: 'center'
    })
        
    
}



function generateInvoiceTable(doc, data) 
{
  let i;
  const dataTableTop = 180;

  doc.font("Helvetica-Bold");
  generateTableRow(
  doc,
  dataTableTop,
  "Id",
  'Title',
  'Description',
  'Price EGP',
  );
  generateHr(doc, dataTableTop + 30);
  doc.font("Helvetica");

  for (i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const position = dataTableTop + (i + 1) * 35;
    generateTableRow(
      doc,
      position,
      item._id,
      item.title,
      item.description,    
      formatCurrency(item.price)
    );

    generateHr(doc, position + 30);
  }

  const total = data.items.reduce(
    (total, item) => total + item.price,
    0
  )
  generateTableRow(
    doc,
    dataTableTop + (i + 1) * 40,
    "",
    "",
    "Total",
    
    formatCurrency(total)
  );
}



function generateFooter(doc)
{
  doc
    .fontSize(10)
    .text(
      "That's today's report",
      50,
      780,
      { align: "center", width: 500 }
    );
}



function generateTableRow (doc, y, item, _id, title, desc, price) {
  doc  
    .fontSize(10)
    .text(item, 50, y)
    .text(_id, 200, y)
    .text(title, 280, y, { width: 90, align: 'right' })
    .text(desc, 370, y, { width: 90, align: 'right' })
    .text(price, 0, y, {  align: 'right' })
}

function generateHr(doc, y)
{
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(amount) 
{
  return  parseInt(amount).toFixed(2);
}


module.exports = 
{
  createProductPDF
};