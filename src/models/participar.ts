import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Evento } from "./evento";

@Entity('participar')
export class Participar {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user: User) => user.participar, { nullable: true })
  userId!: User | null;

  @ManyToOne(() => Evento, { nullable: true })
  eventoId!: Evento | null;


  constructor(

    user?: User | null,
    evento?: Evento | null
  ) {

    this.userId = user ?? null;
    this.eventoId = evento ?? null;
  }
}