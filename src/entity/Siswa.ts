import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Pembayaran } from './Pembayaran';

@Entity('tbl_siswa', { schema: 'sispem' })
export class Siswa {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'nama', type: 'varchar', nullable: true })
  nama: string;

  @Column({ name: 'alamat', type: 'text', nullable: true })
  alamat: string;

  @Column({ name: 'umur', type: 'int', nullable: true })
  umur: number;

  @Column({ name: 'nomor_handphone', type: 'varchar', nullable: true })
  nomor_handphone: number;

  @Column({ name: 'tanggal_masuk', type: 'date', nullable: true })
  tanggal_masuk: string;

  @OneToMany(() => Pembayaran, pembayaran => pembayaran.siswa)
  dataPembayaran: Pembayaran[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
