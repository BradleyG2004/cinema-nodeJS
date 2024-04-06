import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import { Client } from "./client";

@Entity()
export class Token {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @ManyToOne(() => Coordinator, coordinator => coordinator.tokens)
    coordinator: Coordinator;

    @ManyToOne(() => Client, client => client.tokens)
    client: Client;

    constructor(id: number, token: string, coordinator: Coordinator, client: Client) {
        this.id = id
        this.token = token
        this.coordinator = coordinator
        this.client = client

    }
}