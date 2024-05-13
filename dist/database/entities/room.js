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
exports.Room = void 0;
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const seance_1 = require("./seance");
const picture_1 = require("./picture");
const coordinator_1 = require("./coordinator");
const seat_1 = require("./seat");
let Room = class Room {
    constructor(id, type, state, coordinator, seance, accessibility, description, createdAt, capacity, name, picture, seat) {
        this.id = id;
        this.coordinator = coordinator;
        this.picture = picture;
        this.seat = seat;
        this.type = type;
        this.state = state;
        this.name = name;
        this.seance = seance;
        this.capacity = capacity;
        this.accessibility = accessibility;
        this.description = description;
        this.createdAt = createdAt;
    }
};
exports.Room = Room;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Room.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "accessibility", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seance_1.Seance, seance => seance.room),
    __metadata("design:type", Array)
], Room.prototype, "seance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => picture_1.Picture, picture => picture.room),
    __metadata("design:type", Array)
], Room.prototype, "picture", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seat_1.Seat, seat => seat.room),
    __metadata("design:type", Array)
], Room.prototype, "seat", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => coordinator_1.Coordinator, (coordinator) => coordinator.room),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Room.prototype, "coordinator", void 0);
exports.Room = Room = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Boolean, Array, Array, Boolean, String, Date, Number, String, Array, Array])
], Room);
