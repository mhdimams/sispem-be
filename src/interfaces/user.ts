export enum Role {
  ADMIN = 'admin',
  SISWA = 'siswa',
}

export interface IUserBody {
  nama: string;
  username: string;
  password: string;
}

export interface ILoginBody {
  username: string;
  password: string;
}
