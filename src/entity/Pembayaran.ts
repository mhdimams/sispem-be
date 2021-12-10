import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Siswa } from './Siswa';
import { User } from './User';
@Entity('tbl_pembayaran', { schema: 'sispem' })
export class Pembayaran {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ nullable: true })
  siswa_id: number;
  @ManyToOne(() => Siswa, siswa => siswa.dataPembayaran)
  @JoinColumn({ name: 'siswa_id', referencedColumnName: 'id' })
  siswa: Siswa;

  @Column({ nullable: true })
  user_id: number;
  @ManyToOne(() => User, user => user.dataPembayaran)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'bulan', type: 'int', nullable: true })
  bulan: number;

  @Column({ name: 'tahun', type: 'int', nullable: true })
  tahun: number;

  @Column({ name: 'biaya_iuran', type: 'int', nullable: true })
  biaya_iuran: number;

  @Column({ name: 'tanggal_bayar', type: 'datetime', nullable: true })
  tanggal_bayar: Date;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
