import { Service, Inject } from 'typedi';
import { DeleteResult, InsertResult, Like, UpdateResult } from 'typeorm';

import { SiswaModel } from '@entity';
import { ISiswaBody } from '@interfaces';
import padLeadingZeros from '@utils/zeroPrefix';

@Service()
export default class SiswaServices {
  @Inject('SiswaModel')
  private siswaRepo: Models.Siswa;

  public async findAll(): Promise<SiswaModel.Siswa[]> {
    try {
      const result = await this.siswaRepo.find({
        where: { status: SiswaModel.Status.Active },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async findByName(name: string): Promise<SiswaModel.Siswa[]> {
    try {
      const result = await this.siswaRepo.find({ nama: Like(`%${name}%`) });
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: number): Promise<SiswaModel.Siswa> {
    try {
      const result = await this.siswaRepo.findOne({ id: id });
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async insertOne(body: ISiswaBody): Promise<InsertResult> {
    try {
      const result: InsertResult = await this.siswaRepo.insert({ ...body });

      const id = result.generatedMaps[0].id;

      const yearLast = body.tanggal_masuk.split('-')[0].slice(2);
      const endNumber = padLeadingZeros(id, 4);

      await this.siswaRepo.update(id, { nis: `${yearLast}${endNumber}` });

      return result;
    } catch (error) {
      throw error;
    }
  }

  public async updateOne(body: ISiswaBody, id: number): Promise<UpdateResult> {
    try {
      const result = await this.siswaRepo.update(id, { ...body });
      return result;
    } catch (error) {
      throw error;
    }
  }

  public async deleteOne(id: number): Promise<DeleteResult> {
    try {
      return await this.siswaRepo.update(id, {
        status: SiswaModel.Status.Inactive,
      });
    } catch (error) {
      throw error;
    }
  }
}
