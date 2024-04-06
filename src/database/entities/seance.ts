import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import "reflect-metadata"
import { Movie } from "./movie";
import { Ticket } from "./ticket";
import { Room } from "./room";

@Entity()
export class Seance {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "datetime"})
    starting: Date

    @Column({type: "datetime"})
    ending: Date

    @CreateDateColumn({type: "datetime"}) 
    createdAt: Date

    @ManyToMany(() => Ticket, (ticket) => ticket.seance)
    ticket: Ticket[]

    @ManyToOne(() => Coordinator, (coordinator) => coordinator.seance)
    coordinator: Coordinator

    @ManyToOne(() => Room, (room) => room.seance)
    room: Room

    @ManyToOne(() => Movie, (movie) => movie.seance)
    movie: Movie

    constructor(id: number, room:Room, ticket:Ticket[],starting: Date,ending: Date, createdAt: Date, coordinator: Coordinator,movie:Movie) {
        this.id = id
        this.room=room
        this.createdAt = createdAt
        this.starting = starting
        this.ending = ending
        this.movie=movie
        this.ticket=ticket
        this.coordinator = coordinator
    }
}