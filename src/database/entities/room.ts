import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import "reflect-metadata"
import { Seance } from "./seance";
import { Picture } from "./picture";
import { Coordinator } from "./coordinator";
import { Seat } from "./seat";
@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string;

    @Column()
    state: boolean;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @Column()
    description: string;

    @Column()
    accessibility: boolean;

    @CreateDateColumn({type: "datetime"})
    createdAt: Date;

    @OneToMany(() => Seance, seance => seance.room)
    seance: Seance[];

    @OneToMany(() => Picture, picture => picture.room)
    picture: Picture[];

    @OneToMany(() => Seat, seat=> seat.room)
    seat: Seat[];

    @ManyToMany(() => Coordinator, (coordinator) => coordinator.room)
    @JoinTable()
    coordinator: Coordinator[]

    constructor(id: number, type:string,state:boolean,coordinator:Coordinator[], seance:Seance[], accessibility:boolean, description:string, createdAt: Date, capacity:number, name:string,picture:Picture[],seat:Seat[]) {
        this.id = id;
        this.coordinator=coordinator;
        this.picture=picture;
        this.seat=seat;
        this.type=type;
        this.state=state;
        this.name=name;
        this.seance=seance;
        this.capacity=capacity;
        this.accessibility=accessibility;
        this.description=description;
        this.createdAt = createdAt;
    }
}