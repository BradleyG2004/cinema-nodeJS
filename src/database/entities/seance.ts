import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Coordinator } from "./coordinator";
import { Movie } from "./movie";
import { Ticket } from "./ticket";
import { Room } from "./room";
import { Attendee } from "./attendee";

@Entity()
export class Seance {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "datetime" })
    starting!: Date;

    @Column({ type: "datetime" })
    ending!: Date;

    @CreateDateColumn({ type: "datetime" })
    createdAt!: Date;

    // Utilisez `ticket` au lieu de `tickets` ici
    @ManyToMany(() => Ticket, (ticket) => ticket.seance)
    tickets!: Ticket[]; // Assurez-vous de définir le type correctement

    @ManyToOne(() => Coordinator, (coordinator) => coordinator.seance)
    coordinator!: Coordinator;

    @ManyToOne(() => Room, (room) => room.seance)
    room!: Room;

    @ManyToOne(() => Movie, (movie) => movie.seance)
    movie!: Movie;

    @OneToMany(() => Attendee, (attendee) => attendee.seance)
    attendees!: Attendee[];
}
