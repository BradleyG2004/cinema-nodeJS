import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import "reflect-metadata"
import { Movie } from "./movie";
import { Room } from "./room";
import { Occupation } from "./occupation";

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

    @ManyToOne(() => Coordinator, (coordinator) => coordinator.seance)
    coordinator!: Coordinator

    @OneToMany(() => Occupation, (occupation) => occupation.seance)
    occupation!: Occupation

    @ManyToOne(() => Room, (room) => room.seance)
    room!: Room

    @ManyToOne(() => Movie, (movie) => movie.seance)
    movie!: Movie

    getDuration(): number {
        const durationInMilliseconds = new Date(this.ending).getTime() - new Date(this.starting).getTime();
        return Math.floor(durationInMilliseconds / 60000); 
    }
}