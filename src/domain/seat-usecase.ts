import { DataSource } from "typeorm";
import { Seat, SeatType } from "../database/entities/seat";
import { Room } from "../database/entities/room";

export interface ListSeatFilter {
    limit: number;
    page: number;
}

export interface UpdateSeatParams {
    row?: string;
    number?: number;
    type?: SeatType;
    isAvailable?: boolean;
    roomId?: number;
}

export interface SeatRequest {
    row: string;
    number: number;
    type: SeatType;
    isAvailable?: boolean;
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

        if (updateParams.row !== undefined) {
            seatFound.row = updateParams.row;
        }
        if (updateParams.number !== undefined) {
            seatFound.number = updateParams.number;
        }
        if (updateParams.type !== undefined) {
            seatFound.type = updateParams.type;
        }
        if (updateParams.isAvailable !== undefined) {
            seatFound.isAvailable = updateParams.isAvailable;
        }
        if (updateParams.roomId !== undefined) {
            const roomRepo = this.db.getRepository(Room);
            const room = await roomRepo.findOneBy({ id: updateParams.roomId });
            if (room) {
                seatFound.room = room;
            }
        }

        const seatUpdated = await seatRepo.save(seatFound);
        return seatUpdated;
    }

    async validateSeatRequest(seatRequest: SeatRequest): Promise<Room | null> {
        const roomRepo = this.db.getRepository(Room);
        const room = await roomRepo.findOneBy({ id: seatRequest.roomId });
        return room ?? null;
    }

    async createSeat(seatRequest: SeatRequest): Promise<Seat | null> {
        const room = await this.validateSeatRequest(seatRequest);
        if (!room) return null;

        const seatRepo = this.db.getRepository(Seat);

        const newSeat = seatRepo.create({
            row: seatRequest.row,
            number: seatRequest.number,
            type: seatRequest.type,
            isAvailable: seatRequest.isAvailable ?? true,
            room: room
        });

        return await seatRepo.save(newSeat);
    }

    async deleteSeat(id: number): Promise<void> {
        const seatRepo = this.db.getRepository(Seat);
        const seatToDelete = await seatRepo.findOneBy({ id });
        if (seatToDelete) {
            await seatRepo.remove(seatToDelete);
        }
    }
}
