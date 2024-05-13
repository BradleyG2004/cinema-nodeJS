"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Seat = exports.SeatType = void 0;
const typeorm_1 = require("typeorm");
const room_1 = require("./room");
var SeatType;
(function (SeatType) {
    SeatType["regular"] = "REGULAR";
    SeatType["premium"] = "PREMIUM";
    SeatType["vip"] = "VIP";
})(SeatType || (exports.SeatType = SeatType = {}));
let Seat = class Seat {
};
exports.Seat = Seat;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Seat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Seat.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SeatType
    }),
    __metadata("design:type", String)
], Seat.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_1.Room, room => room.seat),
    __metadata("design:type", room_1.Room)
], Seat.prototype, "room", void 0);
exports.Seat = Seat = __decorate([
    (0, typeorm_1.Entity)()
], Seat);
