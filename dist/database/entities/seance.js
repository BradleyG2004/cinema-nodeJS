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
exports.Seance = void 0;
const typeorm_1 = require("typeorm");
const coordinator_1 = require("./coordinator");
const movie_1 = require("./movie");
const room_1 = require("./room");
const attendee_1 = require("./attendee");
const occupation_1 = require("./occupation");
const ticket_1 = require("./ticket");
let Seance = class Seance {
    getDuration() {
        const durationInMilliseconds = new Date(this.ending).getTime() - new Date(this.starting).getTime();
        return Math.floor(durationInMilliseconds / 60000);
    }
};
exports.Seance = Seance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Seance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], Seance.prototype, "starting", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime" }),
    __metadata("design:type", Date)
], Seance.prototype, "ending", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Seance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => ticket_1.Ticket, (ticket) => ticket.seance),
    __metadata("design:type", Array)
], Seance.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coordinator_1.Coordinator, (coordinator) => coordinator.seance),
    __metadata("design:type", coordinator_1.Coordinator)
], Seance.prototype, "coordinator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => occupation_1.Occupation, (occupation) => occupation.seance),
    __metadata("design:type", occupation_1.Occupation)
], Seance.prototype, "occupation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_1.Room, (room) => room.seance),
    __metadata("design:type", room_1.Room)
], Seance.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => movie_1.Movie, (movie) => movie.seance),
    __metadata("design:type", movie_1.Movie)
], Seance.prototype, "movie", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => attendee_1.Attendee, (attendee) => attendee.seance),
    __metadata("design:type", Array)
], Seance.prototype, "attendees", void 0);
exports.Seance = Seance = __decorate([
    (0, typeorm_1.Entity)()
], Seance);
