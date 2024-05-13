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
exports.SeatUsecase = void 0;
const seat_1 = require("../database/entities/seat");
const room_1 = require("../database/entities/room");
// Initialiser un tableau vide à deux dimensions
const tab = [];
// Boucler sur la première dimension (A à E)
for (let i = 0; i < 5; i++) {
    // Initialiser un sous-tableau pour la deuxième dimension
    const stab = [];
    // Boucler sur la deuxième dimension (1 à 5)
    for (let j = 1; j <= 5; j++) {
        // Ajouter l'élément correspondant (A à E) suivi du chiffre (1 à 5) dans le sous-tableau
        stab.push(String.fromCharCode(65 + i) + j);
    }
    // Ajouter le sous-tableau à la première dimension
    tab.push(stab);
}
let i = 0;
let j = 0;
class SeatUsecase {
    constructor(db) {
        this.db = db;
    }
    listSeats(listSeatFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(seat_1.Seat, 'seat');
            query.skip((listSeatFilter.page - 1) * listSeatFilter.limit);
            query.take(listSeatFilter.limit);
            const [seats, totalCount] = yield query.getManyAndCount();
            return {
                seats,
                totalCount
            };
        });
    }
    updateSeat(id, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const seatRepo = this.db.getRepository(seat_1.Seat);
            const seatFound = yield seatRepo.findOneBy({ id });
            if (!seatFound)
                return null;
            if (updateParams.type !== undefined) {
                seatFound.type = updateParams.type;
            }
            const seatUpdated = yield seatRepo.save(seatFound);
            return seatUpdated;
        });
    }
    // async validateSeatRequest(seatRequest: SeatRequest): Promise<Room | null> {
    //     const roomRepo = this.db.getRepository(Room);
    //     const room = await roomRepo.findOneBy({ id: seatRequest.roomId });
    //     return room ?? null;
    // }
    createSeat(seatRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = this.db.getRepository(room_1.Room);
            const roomconcerned = yield room.findOne({
                where: { id: seatRequest.roomId },
                relations: ['seat']
            });
            if (!roomconcerned)
                return "Room not found";
            const rows = yield this.db.getRepository(seat_1.Seat)
                .createQueryBuilder("seat")
                .where("seat.roomId = :value", { value: roomconcerned.id })
                .getCount();
            if (rows > roomconcerned.capacity - 1)
                return "La salle ne peut plus disposer de place";
            const seat = new seat_1.Seat();
            if (j == 4 && i != 4) {
                i++;
                j = 0;
            }
            else if (j != 4 && i != 4) {
                j++;
            }
            else if (i == 4 && j == 4) {
                i = 0;
                j = 0;
            }
            seat.position = tab[i][j];
            seat.room = roomconcerned;
            seat.type = seatRequest.type;
            const seatRepo = this.db.getRepository(seat_1.Seat);
            yield seatRepo.save(seat);
            return seat;
        });
    }
    deleteSeat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const seatRepo = this.db.getRepository(seat_1.Seat);
            const seatToDelete = yield seatRepo.findOneBy({ id });
            if (seatToDelete) {
                yield seatRepo.remove(seatToDelete);
                return "Seat Deleted !";
            }
            return "Seat not found";
        });
    }
}
exports.SeatUsecase = SeatUsecase;
