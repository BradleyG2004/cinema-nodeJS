import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";

@Entity()
export class Picture {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    loc:string

    @ManyToOne(() => Room, room => room.picture)
    room: Room;

    constructor(id: number, loc: string,room:Room) {
        this.id = id
        this.loc=loc
        this.room=room

    }
}