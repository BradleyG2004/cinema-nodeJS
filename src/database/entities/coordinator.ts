import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role";
import { Token } from "./token"
import { Affectation } from "./affectation";
import { Movie } from "./movie";
import "reflect-metadata"
import { Seance } from "./seance";
import { Room } from "./room";

@Entity({ name: "coordinator" })
export class Coordinator {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string


    @CreateDateColumn({type: "datetime"})
    createdAt: Date

    @OneToMany(() => Token, token => token.coordinator)
    tokens: Token[];

    @ManyToOne(() => Role, (role) => role.coordinator)
    role: Role;

    @OneToMany(() => Affectation, (affectation) => affectation.coordinator)
    affectation: Affectation[]

    @OneToMany(() => Movie, (movie) => movie.coordinator)
    movie: Movie[]

    @OneToMany(() => Seance, (seance) => seance.coordinator)
    seance: Seance[]

    @ManyToMany(() => Room, (room) => room.coordinator)
    room: Room[]

    constructor(id: number, room:Room[], email: string, password: string, createdAt: Date, tokens: Token[], role: Role, affectation:Affectation[], movie:Movie[],seance:Seance[]) {
        this.id = id;
        this.room=room;
        this.email = email; 
        this.password = password;
        this.createdAt = createdAt;
        this.tokens = tokens;
        this.affectation=affectation;
        this.role=role;
        this.seance=seance;
        this.movie=movie
    }
}