import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Client } from "./client"; // Assurez-vous d'importer correctement l'entité Client

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0.00 })
    amount!: number;

    @Column({ type: "enum", enum: ["deposit", "withdrawal", "ticket_purchase"], default: "deposit" })
    type!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ nullable: true })
    clientId!: number;

    @ManyToOne(() => Client, client => client.transactions) // Utilisez ManyToOne pour définir la relation
    client!: Client; // Utilisez le nom approprié pour la propriété de relation
}
