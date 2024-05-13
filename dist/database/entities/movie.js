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
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const coordinator_1 = require("./coordinator");
require("reflect-metadata");
const seance_1 = require("./seance");
let Movie = class Movie {
    constructor(id, name, createdAt, coordinator, seance, duration) {
        this.id = id;
        this.duration = duration;
        this.name = name;
        this.createdAt = createdAt;
        this.coordinator = coordinator;
        this.seance = seance;
    }
};
exports.Movie = Movie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movie.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Movie.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Movie.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coordinator_1.Coordinator, (coordinator) => coordinator.movie),
    __metadata("design:type", coordinator_1.Coordinator)
], Movie.prototype, "coordinator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => seance_1.Seance, (seance) => seance.movie),
    __metadata("design:type", Array)
], Movie.prototype, "seance", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, Date, coordinator_1.Coordinator, Array, Number])
], Movie);
