import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Pembayaran } from './Pembayaran';

export enum Status {
  Active = 'active',
  Inactive = 'inactive',
}

@Entity('tbl_siswa', { schema: 'sispem' })
export class Siswa {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'nis', type: 'int', nullable: true })
  nis: string;

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

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.Active,
    nullable: true,
  })
  status: Status;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
