import { getRepository } from 'typeorm';
import { UserModel, PembayaranModel, SiswaModel } from '@entity';

export default [
  {
    name: 'UserModel',
    repository: getRepository(UserModel.User),
  },
  {
    name: 'PembayaranModel',
    repository: getRepository(PembayaranModel.Pembayaran),
  },
  {
    name: 'SiswaModel',
    repository: getRepository(SiswaModel.Siswa),
  },
];
