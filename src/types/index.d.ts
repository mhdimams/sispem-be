import { Repository } from 'typeorm';
import { UserModel, SiswaModel, PembayaranModel } from '@entity';

declare global {
  namespace Express {
    export interface Request {
      currentUser: UserModel.User;
    }
  }

  namespace Models {
    export type User = Repository<UserModel.User>;
    export type Siswa = Repository<SiswaModel.Siswa>;
    export type Pembayaran = Repository<PembayaranModel.Pembayaran>;
  }
}
