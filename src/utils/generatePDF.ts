import PDFDocument from 'pdfkit';
import moment from 'moment';
export const buildPdf = (data: any, dataCallback: any, endCallback: any) => {
  const doc = new PDFDocument();
  doc.on('data', dataCallback);
  doc.on('end', endCallback);
  doc.fontSize(12).text(`Nama : ${data.nama}`);
  doc.fontSize(12).text(`Pembayaran Bulan: ${data.bulan}`);
  doc.fontSize(12).text(`Pembayaran Tahun: ${data.tahun}`);
  doc
    .fontSize(12)
    .text(`Tanggal Bayar: ${moment(data.tanggal).format('DD MMMM YYYY')}`)
    .moveDown();
  doc
    .fontSize(25)
    .text(`====================================`, { align: 'center' })
    .moveDown();
  doc.fontSize(25).text(`Lunas`, { align: 'center' });
  doc.end();
};
