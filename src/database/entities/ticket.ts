import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import { Client } from "./client";
import { Seance } from "./seance";

enum tickettype{
    normal="NORMAL",
    super="SUPER"
}

@Entity()
export class Ticket {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "datetime"}) 
    createdAt: Date

    @ManyToOne(() => Client, client => client.ticket)
    client: Client;
    
    @Column({ type: 'enum', enum: tickettype})
    type: tickettype;

    @ManyToMany(() => Seance, (seance) => seance.ticket)
    @JoinTable()
    seance: Seance[]

    constructor(id: number, seance:Seance[], createdAt:Date, client: Client,type:tickettype) {
        this.id = id
        this.createdAt=createdAt
        this.client = client
        this.type=type
        this.seance=seance
    }
}