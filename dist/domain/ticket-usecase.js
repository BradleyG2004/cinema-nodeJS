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
exports.TicketUsecase = void 0;
const ticket_1 = require("../database/entities/ticket");
const client_1 = require("../database/entities/client");
const seance_1 = require("../database/entities/seance");
class TicketUsecase {
    constructor(db) {
        this.db = db;
    }
    listTickets(listTicketFilter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(ticket_1.Ticket, 'ticket');
            query.skip((listTicketFilter.page - 1) * listTicketFilter.limit);
            query.take(listTicketFilter.limit);
            const [tickets, totalCount] = yield query.getManyAndCount();
            return {
                tickets,
                totalCount
            };
        });
    }
    updateTicket(id, updateParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketRepo = this.db.getRepository(ticket_1.Ticket);
            const ticketFound = yield ticketRepo.findOneBy({ id });
            if (!ticketFound)
                return null;
            if (updateParams.seatNumber !== undefined) {
                ticketFound.seatNumber = updateParams.seatNumber;
            }
            if (updateParams.isValid !== undefined) {
                ticketFound.isValid = updateParams.isValid;
            }
            const ticketUpdated = yield ticketRepo.save(ticketFound);
            return ticketUpdated;
        });
    }
    validateTicketRequest(ticketRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientRepo = this.db.getRepository(client_1.Client);
            const seanceRepo = this.db.getRepository(seance_1.Seance);
            const client = yield clientRepo.findOneBy({ id: ticketRequest.clientId });
            const seance = yield seanceRepo.findOneBy({ id: ticketRequest.seanceId });
            if (!client || !seance) {
                return null;
            }
            return { client, seance };
        });
    }
    useTicketForSeance(ticketId, seanceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketRepo = this.db.getRepository(ticket_1.Ticket);
            const ticket = yield ticketRepo.findOneBy({ id: ticketId });
            if (!ticket) {
                return { status: 'error', message: 'Ticket not found' };
            }
            if (ticket.type === 'SUPER' && ticket.sessionsUsed >= 10) {
                return { status: 'error', message: 'Super Ticket has already been used 10 times' };
            }
            if (ticket.type === 'SUPER') {
                ticket.sessionsUsed++;
                if (ticket.sessionsUsed >= 10) {
                    ticket.isValid = false;
                }
                yield ticketRepo.save(ticket);
            }
            return { status: 'success', message: 'Ticket is valid for this seance' };
        });
    }
    listTicketsByClient(clientId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db.createQueryBuilder(ticket_1.Ticket, 'ticket')
                .where("ticket.clientId = :clientId", { clientId })
                .skip((filter.page - 1) * filter.limit)
                .take(filter.limit);
            const [tickets, totalCount] = yield query.getManyAndCount();
            return {
                tickets,
                totalCount
            };
        });
    }
    createTicket(ticketRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const validation = yield this.validateTicketRequest(ticketRequest);
            if (!validation)
                return null;
            const { client, seance } = validation;
            const ticketRepo = this.db.getRepository(ticket_1.Ticket);
            const newTicket = ticketRepo.create({
                client,
                seance,
                type: ticketRequest.type,
                seatNumber: ticketRequest.seatNumber,
                isValid: (_a = ticketRequest.isValid) !== null && _a !== void 0 ? _a : true
            });
            return yield ticketRepo.save(newTicket);
        });
    }
    deleteTicket(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticketRepo = this.db.getRepository(ticket_1.Ticket);
            const ticketToDelete = yield ticketRepo.findOneBy({ id });
            if (ticketToDelete) {
                yield ticketRepo.remove(ticketToDelete);
            }
        });
    }
}
exports.TicketUsecase = TicketUsecase;
