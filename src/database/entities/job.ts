import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Affectation } from "./affectation";
import "reflect-metadata"

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @CreateDateColumn({type: "datetime"}) 
    createdAt: Date

    @OneToMany(() => Affectation, (affectation) => affectation.job)
    affectations: Affectation[]

    constructor(id: number, title: string, description: string, createdAt: Date, affectations: Affectation[]) {
        this.id = id
        this.title = title
        this.description = description
        this.createdAt = createdAt
        this.affectations = affectations
    }
}