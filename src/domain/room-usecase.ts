import { DataSource } from "typeorm";
import { Room } from "../database/entities/room";
import { Token } from "../database/entities/token";
import { Coordinator } from "../database/entities/coordinator";

export interface ListRoomFilter {
    limit: number
    page: number
}

export interface UpdateRoomParams {
    state:boolean
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

    async updateRoom(id: number,authorization:string ,{ state }: UpdateRoomParams): Promise<Room |null> {
        const repo = this.db.getRepository(Room)
        const roomfound = await repo.findOneBy({ id })
        if (roomfound === null) return null   

        const repo1=this.db.getRepository(Token)
        const tokenfound = await repo1.findOne({ 
            where: { token: authorization },
            relations: ['coordinator'] })
        if (tokenfound === null) return null
    
        const user = tokenfound.coordinator;
        const repo2 = this.db.getRepository(Coordinator);
        
        user.room=[roomfound]
        const maintain = await repo2.save(user)

        roomfound.state = state

        const roomUpdate = await repo.save(roomfound)
        return roomfound
    }
}