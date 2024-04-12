import { DataSource } from "typeorm";
import { Room } from "../database/entities/room";

export interface ListRoomFilter {
    limit: number
    page: number
}

export class RoomUsecase {
    constructor(private readonly db: DataSource) { }

    async listRoom(listRoomFilter: ListRoomFilter): Promise<{ rooms: Room[]; totalCount: number; }> {
        console.log(listRoomFilter)
        const query = this.db.createQueryBuilder(Room, 'room')
        query.skip((listRoomFilter.page - 1) * listRoomFilter.limit)
        query.take(listRoomFilter.limit)

        const [rooms, totalCount] = await query.getManyAndCount()
        return {
            rooms,
            totalCount
        }
    }
}