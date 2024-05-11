import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Token } from "./token";
import { Ticket } from "./ticket";
import { Transaction } from "./Transaction";

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ default: 0 })
    balance!: number;

    @CreateDateColumn({ type: "datetime" })
    createdAt!: Date;

    @OneToMany(() => Token, token => token.client)
    tokens!: Token[];

    @OneToMany(() => Ticket, ticket => ticket.client)
    tickets!: Ticket[];

    @OneToMany(() => Transaction, transaction => transaction.clientId)
    transactions!: Transaction[];


}
