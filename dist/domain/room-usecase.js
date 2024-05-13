"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomUsecase = void 0;
const room_1 = require("../database/entities/room");
const token_1 = require("../database/entities/token");
const coordinator_1 = require("../database/entities/coordinator");
class RoomUsecase {
    constructor(db) {
        this.db = db;
    }
    listRoom(listRoomFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(listRoomFilter);
            const query = this.db.createQueryBuilder(room_1.Room, 'room');
            query.skip((listRoomFilter.page - 1) * listRoomFilter.limit);
            query.take(listRoomFilter.limit);
            const [rooms, totalCount] = yield query.getManyAndCount();
            return {
                rooms,
                totalCount
            };
        });
    }
    updateRoom(id, authorization, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = this.db.getRepository(room_1.Room);
            const roomfound = yield repo.findOneBy({ id });
            if (roomfound === null)
                return null;
            const repo1 = this.db.getRepository(token_1.Token);
            const tokenfound = yield repo1.findOne({
                where: { token: authorization },
                relations: ['coordinator']
            });
            if (tokenfound === null)
                return null;
            const user = tokenfound.coordinator;
            const repo2 = this.db.getRepository(coordinator_1.Coordinator);
            user.room = [roomfound];
            const maintain = yield repo2.save(user);
            if (params.type) {
                roomfound.type = params.type;
            }
            if (params.name) {
                roomfound.name = params.name;
            }
            if (params.description) {
                roomfound.description = params.description;
            }
            if (params.capacity) {
                roomfound.capacity = params.capacity;
            }
            if (params.state) {
                roomfound.state = params.state;
            }
            if (params.accessibility) {
                roomfound.accessibility = params.accessibility;
            }
            const roomUpdate = yield repo.save(roomfound);
            return roomfound;
        });
    }
}
exports.RoomUsecase = RoomUsecase;
