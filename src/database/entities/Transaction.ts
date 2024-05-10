import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { Client } from "./client";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    amount: number;

    @Column({ type: "enum", enum: ["deposit", "withdrawal", "ticket_purchase"] })
    type: string;

    @ManyToOne(() => Client, client => client.transactions)
    client!: Client;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    constructor(amount: number, type: string, client: Client) {
        this.amount = amount;
        this.type = type;
        this.createdAt = new Date();
    }
}
