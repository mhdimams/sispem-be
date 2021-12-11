import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import { Inject, Service } from 'typedi';

import Controller from '@controllers/Controller';
import autobind from '@utils/autobind';
import PembayaranService from '@services/pembayaranServices';
import SiswaServices from '@services/siswaServices';
import { buildPdf } from '@utils/generatePDF';
import { createExcel } from '@utils/createExcel';

@Service()
export default class PembayaranController extends Controller {
  private month: string[] = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  constructor(
    @Inject() private payServices: PembayaranService,
    @Inject() private siswaServices: SiswaServices,
  ) {
    super();
  }

  @autobind
  public async transaksiPembayaran(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.payServices.bayar({
      ...req.body,
      tanggal_bayar: moment(
        req.body.tanggal_bayar,
        'YYYY-MM-DD HH:mm:ss',
      ).format('YYYY-MM-DD HH:mm:ss'),
    });

    this.response(res, 200, result);
  }

  @autobind
  public async getPembayaranSiswaPertahun(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { siswa_id, tahun } = req.query;

    const siswa = await this.siswaServices.findById(
      parseInt(siswa_id as string),
    );
    const result = await this.payServices.pembayaranPerSiswa(
      parseInt(siswa_id as string),
      parseInt(tahun as string),
    );

    const data = this.month.map((item: string, index: number) => {
      const data = result.find((item: any) => item.bulan === index + 1);

      return {
        month: item,
        bulan: data?.bulan || index + 1,
        pembayaran: this.payServices.biaya_iuran,
        tanggal_bayar: data?.tanggal_bayar || null,
        status: data?.tanggal_bayar ? 'Lunas' : 'Belum Lunas',
      };
    });

    this.response(res, 200, { siswa, dataPembayaran: data });
  }

  @autobind
  public async getPembayaranById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.params;

    const result = await this.payServices.findById(parseInt(id as string));

    this.response(res, 200, result);
  }

  @autobind async generateDownloadPDF(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { siswa_id, bulan, tahun } = req.body;

    const data = await this.payServices.pembayaranSiswaPerBulan(
      siswa_id,
      tahun,
      bulan,
    );
    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=invoice.pdf',
    });

    buildPdf(
      {
        nama: data.siswa.nama,
        bulan: data.bulan,
        tahun: data.tahun,
        tanggal: data.tanggal_bayar,
      },
      chunk => stream.write(chunk),
      () => stream.end(),
    );
  }

  @autobind
  public async getRangePembayaran(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { startDate, endDate } = req.body;

    const result = await this.payServices.findByRangeDate(startDate, endDate);

    const data = result.map(item => ({
      id: item.id,
      nama: item.siswa.nama,
      tanggal_bayar: moment(item.tanggal_bayar)
        .utcOffset('+0700')
        .format('YYYY-MM-DD'),
      pembayaran: item.biaya_iuran,
      bulan: this.month[item.bulan - 1],
    }));

    this.response(res, 200, data);
  }

  @autobind
  public async getDownloadExcel(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { startDate, endDate } = req.body;

    const result = await this.payServices.findByRangeDate(
      startDate as string,
      endDate as string,
    );

    const data = result.map(item => ({
      id: item.id,
      nama: item.siswa.nama,
      tanggal_bayar: moment(item.tanggal_bayar)
        .utcOffset('+0700')
        .format('YYYY-MM-DD'),
      pembayaran: item.biaya_iuran,
      bulan: this.month[item.bulan - 1],
    }));

    const header = [
      { header: 'Nama', key: 'nama', width: 25 },
      { header: 'Tanggal Bayar', key: 'tanggal_bayar', width: 15 },
      { header: 'Pembayaran', key: 'pembayaran', width: 15 },
      { header: 'Bulan', key: 'bulan', width: 15 },
    ];

    const stream: Buffer = await createExcel(header, data);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=InvitedRespondent_.xlsx`,
    );

    res.setHeader('Content-Length', stream.length);
    res.send(stream);
  }
}
