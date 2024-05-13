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
exports.Token = void 0;
const typeorm_1 = require("typeorm");
const coordinator_1 = require("./coordinator");
const client_1 = require("./client");
let Token = class Token {
    constructor(id, token, coordinator, client) {
        this.id = id;
        this.token = token;
        this.coordinator = coordinator;
        this.client = client;
    }
};
exports.Token = Token;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Token.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Token.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => coordinator_1.Coordinator, coordinator => coordinator.tokens),
    __metadata("design:type", coordinator_1.Coordinator)
], Token.prototype, "coordinator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_1.Client, client => client.tokens),
    __metadata("design:type", client_1.Client)
], Token.prototype, "client", void 0);
exports.Token = Token = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, String, coordinator_1.Coordinator, client_1.Client])
], Token);
