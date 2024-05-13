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
exports.Client = void 0;
const typeorm_1 = require("typeorm");
const token_1 = require("./token");
const ticket_1 = require("./ticket");
const Transaction_1 = require("./Transaction");
let Client = class Client {
};
exports.Client = Client;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Client.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "datetime" }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => token_1.Token, token => token.client),
    __metadata("design:type", Array)
], Client.prototype, "tokens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_1.Ticket, ticket => ticket.client),
    __metadata("design:type", Array)
], Client.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Transaction_1.Transaction, transaction => transaction.client),
    __metadata("design:type", Array)
], Client.prototype, "transactions", void 0);
exports.Client = Client = __decorate([
    (0, typeorm_1.Entity)()
], Client);
