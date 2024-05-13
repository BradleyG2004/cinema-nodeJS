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
exports.Ticket = exports.TicketType = void 0;
const typeorm_1 = require("typeorm");
const client_1 = require("./client");
const seance_1 = require("./seance");
var TicketType;
(function (TicketType) {
    TicketType["normal"] = "NORMAL";
    TicketType["super"] = "SUPER";
})(TicketType || (exports.TicketType = TicketType = {}));
let Ticket = class Ticket {
    constructor(id, seance, createdAt, client, type, seatNumber, isValid, sessionsUsed) {
        this.id = id;
        this.createdAt = createdAt;
        this.client = client;
        this.type = type;
        this.seance = seance;
        this.isValid = isValid;
        this.seatNumber = seatNumber;
        this.sessionsUsed = sessionsUsed;
    }
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Ticket.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_1.Client, client => client.tickets),
    __metadata("design:type", client_1.Client)
], Ticket.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => seance_1.Seance, seance => seance.tickets),
    __metadata("design:type", seance_1.Seance)
], Ticket.prototype, "seance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "seatNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Ticket.prototype, "sessionsUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Ticket.prototype, "isValid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TicketType
    }),
    __metadata("design:type", String)
], Ticket.prototype, "type", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Number, seance_1.Seance, Date, client_1.Client, String, Number, Boolean, Number])
], Ticket);
