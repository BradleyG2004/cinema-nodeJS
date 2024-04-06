import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm"
import { Token } from "./token"
import "reflect-metadata"
import { Ticket } from "./ticket"
@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string

    @Column()
    balance: number

    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @OneToMany(() => Token, token => token.client)
    tokens: Token[];

    @OneToMany(() => Ticket, ticket => ticket.client)
    ticket: Ticket[];

    constructor(id: number, balance:number, email: string, password: string, createdAt: Date, tokens: Token[],ticket:Ticket[]) {
        this.id = id;
        this.balance=balance;
        this.email = email; 
        this.password = password;
        this.createdAt = createdAt;
        this.ticket=ticket;
        this.tokens = tokens;
    }
}