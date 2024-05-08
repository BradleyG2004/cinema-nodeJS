import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";

export enum SeatType {
    regular = "REGULAR",
    premium = "PREMIUM",
    vip = "VIP"
}

@Entity()
export class Seat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    row: string;

    @Column()
    number: number;

    @Column({
        type: 'enum',
        enum: SeatType
    })
    type: SeatType;

    @Column({ default: true })
    isAvailable: boolean;

    @ManyToOne(() => Room, room => room.seats)
    room: Room ;



    constructor(id: number, row:string,  number: number, room: Room,type:SeatType,seatNumber:number,isAvailable:boolean) {
        this.id = id
        this.number=number
        this.row = row
        this.type=type
        this.isAvailable=isAvailable
        this.room=room
        
    }
}
