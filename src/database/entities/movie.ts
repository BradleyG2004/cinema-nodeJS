import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import "reflect-metadata"
import { Seance } from "./seance";

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    duration: number

    @CreateDateColumn({type: "datetime"}) 
    createdAt: Date

    @ManyToOne(() => Coordinator, (coordinator) => coordinator.movie)
    coordinator: Coordinator

    @OneToMany(() => Seance, (seance) => seance.movie)  
    seance: Seance[]

    constructor(id: number, name: string, createdAt: Date, coordinator: Coordinator,seance:Seance[],duration:number) {
        this.id = id
        this.duration=duration
        this.name = name
        this.createdAt = createdAt
        this.coordinator = coordinator
        this.seance=seance
    }
}