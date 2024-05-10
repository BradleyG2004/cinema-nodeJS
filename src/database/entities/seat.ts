import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";
import { Ticket } from "./ticket";

export enum SeatType {
    regular = "REGULAR",
    premium = "PREMIUM",
    vip = "VIP"
}

@Entity()
export class Seat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    position!: string;

    @Column({
        type: 'enum',
        enum: SeatType
    })
    type!: SeatType;

    @ManyToOne(() => Room, room => room.seat)
    room!: Room ;

}
