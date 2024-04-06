import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Affectation } from "./affectation";
import "reflect-metadata"

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @CreateDateColumn({type: "datetime"}) 
    createdAt: Date

    @OneToMany(() => Affectation, (affectation) => affectation.employee)
    affectations: Affectation[]

    constructor(id: number, name: string, createdAt: Date, affectations: Affectation[]) {
        this.id = id
        this.name = name
        this.createdAt = createdAt
        this.affectations = affectations
    }
}