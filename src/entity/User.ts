import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum Role {
  SISWA = 'siswa',
  ADMIN = 'admin',
}

import { Pembayaran } from './Pembayaran';

@Entity('tbl_user', { schema: 'sispem' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'nama', type: 'varchar', nullable: true })
  nama: string;

  @Column({ name: 'username', type: 'varchar', nullable: true })
  username: string;

  @Column({ name: 'password', type: 'varchar', nullable: true })
  password?: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
    nullable: true,
  })
  role: Role;

  @OneToMany(() => Pembayaran, pembayaran => pembayaran.siswa)
  dataPembayaran: Pembayaran[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
