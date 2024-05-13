import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Client } from "./client";
import { Eaccount } from "./eaccount";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;
     
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    amount!: number;

    @Column({ type: "enum", enum: ["deposit", "withdrawal", "ticket_purchase"], default: "deposit" })
    type!: string;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;
     
    @Column()
    description!: string;

    @ManyToOne(() => Client, (client) => client.transactions)
    client!: Client

    @ManyToOne(() => Eaccount, (eaccount) => eaccount.transactions)
    eaccount!: Eaccount
}
