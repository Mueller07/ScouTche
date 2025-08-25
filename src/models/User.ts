import {Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad, BeforeInsert, BeforeUpdate,} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Evento } from './evento';

import { Participar } from './participar';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  senha!: string;

  @Column({ nullable: true })
  tipoConta!: string;
 @Column({type:'int'})
  avatar!:number


  @Column({ type: 'date', nullable: true })
  nascimento?: string;

  @Column({ nullable: true })
  bio?: string;

 


   @OneToMany(() => Evento, (evento:Evento) => evento.user,{ nullable: true })
 eventos!:Evento[];



 @OneToMany(() => Participar, (participar:Participar) => participar.userId,{ nullable: true })
 participar!:Participar[];


 private originalPassword!: string;

 @AfterLoad()
 setOriginalPassword() {
   this.originalPassword = this.senha;
 }

 @BeforeInsert()
 @BeforeUpdate()
 async hashPassword() {
   if (this.senha !== this.originalPassword) {
     const isHashed=this.senha.startsWith('$2a$') ||this.senha.startsWith('$2b$') ||this.senha.startsWith('$2y$');
     if (!isHashed) {
       this.senha = await bcrypt.hash(this.senha, 10);
     }
   }
 }
}