import { DataSource } from "typeorm";
import { Seat, SeatType } from "../database/entities/seat";
import { Room } from "../database/entities/room";

export interface ListSeatFilter {
    limit: number;
    page: number;
}

// Initialiser un tableau vide à deux dimensions
const tab: string[][] = [];

// Boucler sur la première dimension (A à E)
for (let i = 0; i < 5; i++) {
    // Initialiser un sous-tableau pour la deuxième dimension
    const stab: string[] = [];
    // Boucler sur la deuxième dimension (1 à 5)
    for (let j = 1; j <= 5; j++) {
        // Ajouter l'élément correspondant (A à E) suivi du chiffre (1 à 5) dans le sous-tableau
        stab.push(String.fromCharCode(65 + i) + j);
    }
    // Ajouter le sous-tableau à la première dimension
    tab.push(stab);
}

let i=0
let j=0


export interface UpdateSeatParams {
    type?: SeatType;
    isAvailable?: boolean;
}

export interface SeatRequest {
    type: SeatType;
    roomId: number;
}

export class SeatUsecase {
    constructor(private readonly db: DataSource) {}

    async listSeats(listSeatFilter: ListSeatFilter): Promise<{ seats: Seat[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Seat, 'seat');
        query.skip((listSeatFilter.page - 1) * listSeatFilter.limit);
        query.take(listSeatFilter.limit);

        const [seats, totalCount] = await query.getManyAndCount();
        return {
            seats,
            totalCount
        };
    }

    async updateSeat(id: number, updateParams: UpdateSeatParams): Promise<Seat | null> {
        const seatRepo = this.db.getRepository(Seat);
        const seatFound = await seatRepo.findOneBy({ id });
        if (!seatFound) return null;

        if (updateParams.type !== undefined) {
            seatFound.type = updateParams.type;
        }

        const seatUpdated = await seatRepo.save(seatFound);
        return seatUpdated;
    }

    // async validateSeatRequest(seatRequest: SeatRequest): Promise<Room | null> {
    //     const roomRepo = this.db.getRepository(Room);
    //     const room = await roomRepo.findOneBy({ id: seatRequest.roomId });
    //     return room ?? null;
    // }

    async createSeat(seatRequest: SeatRequest): Promise<Seat | null | string> {
        const room = this.db.getRepository(Room);
        const roomconcerned = await room.findOne({
            where: { id: seatRequest.roomId },
            relations: ['seat']
        });
        if (!roomconcerned) return "Room not found";

        const rows = await this.db.getRepository(Seat)
            .createQueryBuilder("seat")
            .where("seat.roomId = :value", { value: roomconcerned.id})
            .getCount();

        if(rows>roomconcerned.capacity) return "La salle ne peut plus disposer de place"

        const seat = new Seat()
        if(j==4 && i!=4){
            i++
            j=0
        }else if(j!=4 && i!=4){
            j++
        }else if(i==4 && j==4){
            i=0
            j=0
        }
        seat.position=tab[i][j]
        seat.room=roomconcerned
        seat.type=seatRequest.type

        const seatRepo = this.db.getRepository(Seat);
        await seatRepo.save(seat);
        return seat;
    }

    async deleteSeat(id: number): Promise<string> {
        const seatRepo = this.db.getRepository(Seat);
        const seatToDelete = await seatRepo.findOneBy({ id });
        if (seatToDelete) {
            await seatRepo.remove(seatToDelete);
            return "Seat Deleted !"
        }
        return "Seat not found"
    }
}
