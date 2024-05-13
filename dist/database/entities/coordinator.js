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
exports.Coordinator = void 0;
const typeorm_1 = require("typeorm");
const role_1 = require("./role");
const token_1 = require("./token");
const affectation_1 = require("./affectation");
const movie_1 = require("./movie");
require("reflect-metadata");
const seance_1 = require("./seance");
const room_1 = require("./room");
let Coordinator = class Coordinator {
    constructor(id, room, email, password, createdAt, tokens, role, affectation, movie, seance) {
        this.id = id;
        this.room = room;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.tokens = tokens;
        this.affectation = affectation;
        this.role = role;
        this.seance = seance;
        this.movie = movie;
    }
};
exports.Coordinator = Coordinator;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Coordinator.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], Coordinator.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coordinator.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Coordinator.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_1.Token, token => token.coordinator),
    __metadata("design:type", Array)
], Coordinator.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_1.Role, (role) => role.coordinator),
    __metadata("design:type", role_1.Role)
], Coordinator.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => affectation_1.Affectation, (affectation) => affectation.coordinator),
    __metadata("design:type", Array)
], Coordinator.prototype, "affectation", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movie_1.Movie, (movie) => movie.coordinator),
    __metadata("design:type", Array)
], Coordinator.prototype, "movie", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seance_1.Seance, (seance) => seance.coordinator),
    __metadata("design:type", Array)
], Coordinator.prototype, "seance", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => room_1.Room, (room) => room.coordinator),
    __metadata("design:type", Array)
], Coordinator.prototype, "room", void 0);
exports.Coordinator = Coordinator = __decorate([
    (0, typeorm_1.Entity)({ name: "coordinator" }),
    __metadata("design:paramtypes", [Number, Array, String, String, Date, Array, role_1.Role, Array, Array, Array])
], Coordinator);
