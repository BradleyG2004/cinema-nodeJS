import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import "reflect-metadata"
import { Movie } from "./movie";
import { Ticket } from "./ticket";
import { Room } from "./room";

@Entity()
export class Seance {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "datetime" })
    starting!: Date;

    @Column({type: "datetime"})
    ending!: Date

    @CreateDateColumn({type: "datetime"}) 
    createdAt!: Date

    @ManyToMany(() => Ticket, (ticket) => ticket.seance)
    ticket!: Ticket[]

    @ManyToOne(() => Coordinator, (coordinator) => coordinator.seance)
    coordinator!: Coordinator

    @ManyToOne(() => Room, (room) => room.seance)
    room!: Room

    @ManyToOne(() => Movie, (movie) => movie.seance)
    movie!: Movie

    getDuration(): number {
        const durationInMilliseconds = new Date(this.ending).getTime() - new Date(this.starting).getTime();
        return Math.floor(durationInMilliseconds / 60000); 
    }
}