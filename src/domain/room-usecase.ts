import { DataSource } from "typeorm";
import { Room } from "../database/entities/room";
import { Token } from "../database/entities/token";
import { Coordinator } from "../database/entities/coordinator";

export interface ListRoomFilter {
    limit: number
    page: number
}

export interface UpdateRoomParams {
    type?:string,
    name?:string,
    description?:string,
    capacity?:number,
    state?:boolean,
    accessibility?: boolean,
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

    async updateRoom(id: number,authorization:string ,params: UpdateRoomParams): Promise<Room |null> {
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
        
        if(params.type){roomfound.type = params.type}
        if(params.name){roomfound.name = params.name}
        if(params.description){roomfound.description = params.description}
        if(params.capacity){roomfound.capacity = params.capacity}
        if(params.state){roomfound.state = params.state}
        if(params.accessibility){roomfound.accessibility = params.accessibility}

        const roomUpdate = await repo.save(roomfound)
        return roomfound
    }
}