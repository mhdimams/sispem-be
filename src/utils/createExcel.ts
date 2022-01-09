import * as excel from 'exceljs';

export const createExcel = async (
  headers: Partial<excel.Column>[],
  rows: any[],
  total: number,
  sheetName: string = 'My Worksheet',
): Promise<Buffer> => {
  const workbook: excel.stream.xlsx.WorkbookWriter =
    new excel.stream.xlsx.WorkbookWriter({});
  const sheet: excel.Worksheet = workbook.addWorksheet(sheetName);
  sheet.columns = headers;
  for (let i = 0; i < rows.length; i++) {
    sheet.addRow(rows[i]);
  }

  const g2 = sheet.getCell('G2');
  g2.value = 'Total Pembayaran';
  g2.font = {
    bold: true,
  };

  const h2 = sheet.getCell('H2');
  h2.value = total;
  h2.font = {
    bold: true,
  };
  sheet.commit();
  return new Promise((resolve, reject): void => {
    workbook
      .commit()
      .then(() => {
        const stream: any = (workbook as any).stream;
        const result: Buffer = stream.read();
        resolve(result);
      })
      .catch(e => {
        reject(e);
      });
  });
};
