import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import { Client } from "./client";
import { Seance } from "./seance";
import { Seat } from "./seat";
import { Occupation } from "./occupation";

    export enum TicketType {
        normal = "NORMAL",
        super = "SUPER"
    }
    
    @Entity()
    export class Ticket {
    
        @PrimaryGeneratedColumn()
        id!: number;
    
        @CreateDateColumn({ type: "timestamp" })
        createdAt!: Date;
    
        @ManyToOne(() => Client, client => client.ticket)
        client!: Client;

        @OneToMany(() => Occupation, occupation => occupation.ticket)
        occupation!: Occupation[];
    
        @Column({ nullable: true })
        seatId!: number;

        @Column({ nullable: true })
        roomId!:number
    
        @Column({ default: true })
        isValid!: boolean;
    
        @Column({
            type: 'enum',
            enum: TicketType
        })
        type!: TicketType;
    
    
  


    // constructor(id: number, seance:Seance[], createdAt:Date, client: Client,type:TicketType,seatId:number,roomId:number,isValid:boolean,occupation:Occupation[]) {
    //     this.id = id
    //     this.createdAt=createdAt
    //     this.client = client
    //     this.roomId=roomId
    //     this.type=type
    //     this.occupation=occupation
    //     this.seance=seance
    //     this.isValid=isValid
    //     this.seatId=seatId
    // }
}