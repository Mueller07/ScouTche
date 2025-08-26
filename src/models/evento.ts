import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User } from "./User";
import { Participar } from "./participar";
@Entity('evento')
export class Evento{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: "enum", enum: ['Seletiva', 'Torneio', 'Jogo'], nullable: false})
    tipo: string //USAR CHECK

    @Column({type: "varchar", length: 255, nullable: false})
    nome: string

    @Column({type: "varchar", length: 255})
    desc: string    

    @Column({ type: "varchar", length: 255 }) // ✅ CORRETO
    cep: string;

    @Column({type: "enum", enum: ['Basquete', 'Futebol', 'Volei'], nullable: false})
    modalidade: string //USAR CHECK

    
   @ManyToOne(() => User, (user) => user.eventos,{ nullable: true })
    user!:User | null;

    @OneToMany(() => Participar, (participar:Participar) => participar.eventoId,{ nullable: true })
    participar!:Participar[];

    //IDCLUBE E IDUSUARIO

    constructor(tipo: string,nome: string,desc: string ,cep: string, modalidade: string, user:User){
        this.tipo = tipo
        this.nome = nome
        this.desc = desc
        this.cep = cep
        this.modalidade = modalidade
        this.user=user
    }
}