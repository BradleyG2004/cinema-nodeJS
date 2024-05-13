import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import { Client } from "./client";
import { Seance } from "./seance";

    export enum TicketType {
        normal = "NORMAL",
        super = "SUPER"
    }
    
    @Entity()
    export class Ticket {
    
        @PrimaryGeneratedColumn()
        id: number;
    
        @CreateDateColumn({ type: "timestamp" })
        createdAt: Date;
    
        @ManyToOne(() => Client, client => client.tickets)
        client: Client;
    
        @ManyToOne(() => Seance, seance => seance.tickets)
        seance: Seance;
    
        @Column({ nullable: true })
        seatNumber?: number;

        @Column({ default: 0 })
        sessionsUsed: number; 

        @Column({ default: true })
        isValid: boolean;
    
        @Column({
            type: 'enum',
            enum: TicketType
        })
        type: TicketType;
    
    
       @Column("float")
        price: number;   
    
        constructor(id: number, seance: Seance, createdAt: Date, client: Client, type: TicketType, seatNumber: number, isValid: boolean, sessionsUsed: number, price: number) {
            this.id = id;
            this.createdAt = createdAt;
            this.client = client;
            this.type = type;
            this.seance = seance;
            this.isValid = isValid;
            this.seatNumber = seatNumber;
            this.sessionsUsed = sessionsUsed;
            this.price = price;  
        }
    }