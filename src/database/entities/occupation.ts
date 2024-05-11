import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm"
import { Ticket } from "./ticket"
import { Seance } from "./seance"

@Entity()
export class Occupation {
    @CreateDateColumn({type: "datetime"})
    createdAt!: Date;
    
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Ticket, (ticket) => ticket.occupation)
    ticket!: Ticket

    @ManyToOne(() => Seance, (seance) => seance.occupation)
    seance!: Seance

    @Column({ nullable: true })
    roomId!:number
    
    @Column({ nullable: true })
    seatId!:number

    @Column({ type: "datetime" })
    starting!: Date;

    @Column({type: "datetime"})
    ending!: Date

}