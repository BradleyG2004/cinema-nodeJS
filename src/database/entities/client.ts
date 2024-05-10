import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Token } from "./token";
import { Ticket } from "./ticket";
import { Transaction } from "./Transaction";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    balance: number;

    @CreateDateColumn({ type: "datetime" })
    createdAt: Date;

    @OneToMany(() => Token, token => token.client)
    tokens: Token[];

    @OneToMany(() => Ticket, ticket => ticket.client)
    tickets: Ticket[];

    @OneToMany(() => Transaction, transaction => transaction.client)
    transactions: Transaction[];

    constructor(id: number, email: string, password: string, balance: number = 0, createdAt: Date = new Date(), tokens: Token[] = [], tickets: Ticket[] = [], transactions: Transaction[] = []) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.balance = balance;
        this.createdAt = createdAt;
        this.tokens = tokens;
        this.tickets = tickets;
        this.transactions = transactions;
    }
}
