import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Affectation } from "./affectation";
import "reflect-metadata"
import { Client } from "./client";
import { Transaction } from "./Transaction";

@Entity()
export class Eaccount {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    balance!: number

    @CreateDateColumn({type: "datetime"}) 
    createdAt!: Date 

    @OneToMany(() => Transaction, transaction => transaction.eaccount)
    transactions!: Transaction[];
}