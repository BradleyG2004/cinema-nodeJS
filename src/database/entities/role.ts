import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import "reflect-metadata"

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @CreateDateColumn({type: "datetime"}) 
    createdAt: Date

    @OneToMany(() => Coordinator, (coordinator) => coordinator.role)
    coordinator: Coordinator[]

    constructor(id: number, name: string, createdAt: Date, coordinator: Coordinator[]) {
        this.id = id
        this.name = name
        this.createdAt = createdAt
        this.coordinator = coordinator
    }
}