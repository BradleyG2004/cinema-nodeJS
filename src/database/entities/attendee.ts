import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Seance } from "./seance";

@Entity()
export class Attendee {
    @PrimaryGeneratedColumn()
    id!: number;


    @ManyToOne(() => Seance, seance => seance.attendees)
    @JoinColumn({ name: "seanceId" })
    seance!: Seance;

}