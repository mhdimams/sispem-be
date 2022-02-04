import PDFDocument from 'pdfkit';
import moment from 'moment';
import parseNumber from '@utils/parseNumber';

export const buildPdf = (data: any, dataCallback: any, endCallback: any) => {
  const doc = new PDFDocument();
  doc.on('data', dataCallback);
  doc.on('end', endCallback);
  doc.image('images/Header.jpg', 0, 10, {
    width: 610,
    height: 150,
  });

  doc.fontSize(24).text('INVOICE', 250, 170);
  doc.fontSize(16).text(`Nama                      : ${data.nama}`, 80, 220);
  doc.fontSize(16).text(`Pembayaran Bulan : ${data.bulan}`);
  doc.fontSize(16).text(`Pembayaran Tahun : ${data.tahun}`);
  doc
    .fontSize(16)
    .text(
      `Tanggal Bayar         : ${moment(data.tanggal).format(
        'DD MMMM YYYY - HH:mm:ss',
      )}`,
    );

  doc
    .fontSize(16)
    .text(
      `Total Bayar              : Rp. ${parseNumber(
        data.totalBayar.toString(),
      )}`,
    )
    .moveDown();
  doc.moveDown();
  doc.fontSize(25).text(`Lunas`, { align: 'right' });
  doc.end();
};
