import { Service, Inject } from 'typedi';

import { IPembayaranBody } from '@interfaces';
import { InsertResult, Between } from 'typeorm';
import autobind from '@utils/autobind';

@Service()
export default class PembayaranServices {
  @Inject('PembayaranModel')
  private pembayaranRepo: Models.Pembayaran;
  public biaya_iuran: number = 60000;

  public async pembayaranPerSiswa(
    siswa_id: number,
    tahun: number,
  ): Promise<any> {
    try {
      const result = await this.pembayaranRepo.find({
        where: { siswa_id: siswa_id, tahun: tahun },
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async pembayaranSiswaPerBulan(
    siswa_id: number,
    tahun: number,
    bulan: number,
  ) {
    try {
      const result = await this.pembayaranRepo.findOne({
        where: { siswa_id: siswa_id, tahun: tahun, bulan: bulan },
        relations: ['siswa'],
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async bayar({
    siswa_id,
    tahun,
    bulan,
    tanggal_bayar,
  }: IPembayaranBody): Promise<InsertResult> {
    try {
      const result = await this.pembayaranRepo.insert({
        siswa_id,
        tahun,
        bulan,
        tanggal_bayar,
        biaya_iuran: this.biaya_iuran,
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: number) {
    try {
      const result = await this.pembayaranRepo.findOne(
        { id: id },
        { relations: ['siswa'] },
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async findByRangeDate(startDate: string, endDate: string) {
    const result = await this.pembayaranRepo.find({
      where: {
        tanggal_bayar: Between(startDate, endDate),
      },
      relations: ['siswa'],
    });

    return result;
  }
}
