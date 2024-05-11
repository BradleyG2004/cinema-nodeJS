import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

    @Column({ nullable: true })
    clientId!: number;
}
