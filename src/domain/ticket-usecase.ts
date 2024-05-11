import { DataSource } from "typeorm";
import { Ticket ,TicketType} from "../database/entities/ticket";
import { Client } from "../database/entities/client";
import { Seance } from "../database/entities/seance";

export interface ListTicketFilter {
    limit: number;
    page: number;
}

export interface UpdateTicketParams {
    seatNumber?: number;
    isValid?: boolean;
}

export interface TicketRequest {
    clientId: number;
    seanceId: number;
    seatNumber?: number;
    isValid?: boolean;
    type: TicketType;
}

export class TicketUsecase {
    constructor(private readonly db: DataSource) {}

    async listTickets(listTicketFilter: ListTicketFilter): Promise<{ tickets: Ticket[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Ticket, 'ticket');
        query.skip((listTicketFilter.page - 1) * listTicketFilter.limit);
        query.take(listTicketFilter.limit);

        const [tickets, totalCount] = await query.getManyAndCount();
        return {
            tickets,
            totalCount
        };
    }

    async updateTicket(id: number, updateParams: UpdateTicketParams): Promise<Ticket | null> {
        const ticketRepo = this.db.getRepository(Ticket);
        const ticketFound = await ticketRepo.findOneBy({ id });
        if (!ticketFound) return null;

        if (updateParams.seatNumber !== undefined) {
            ticketFound.seatNumber = updateParams.seatNumber;
        }
        if (updateParams.isValid !== undefined) {
            ticketFound.isValid = updateParams.isValid;
        }

        const ticketUpdated = await ticketRepo.save(ticketFound);
        return ticketUpdated;
    }
  
    async validateTicketRequest(ticketRequest: TicketRequest): Promise<{ client: Client; seance: Seance; } | null> {
        const clientRepo = this.db.getRepository(Client);
        const seanceRepo = this.db.getRepository(Seance);

        const client = await clientRepo.findOneBy({ id: ticketRequest.clientId });
        const seance = await seanceRepo.findOneBy({ id: ticketRequest.seanceId });

        if (!client || !seance) {
            return null;
        }

        return { client, seance };
    }
     async useTicketForSeance(ticketId: number, seanceId: number): Promise<any> {
        const ticketRepo = this.db.getRepository(Ticket);
        const ticket = await ticketRepo.findOneBy({ id: ticketId });
    
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
            await ticketRepo.save(ticket);
        }
    
        return { status: 'success', message: 'Ticket is valid for this seance' };
    }
    
    
    
    async listTicketsByClient(clientId: number, filter: ListTicketFilter): Promise<{ tickets: Ticket[]; totalCount: number; }> {
        const query = this.db.createQueryBuilder(Ticket, 'ticket')
                            .where("ticket.clientId = :clientId", { clientId })
                            .skip((filter.page - 1) * filter.limit)
                            .take(filter.limit);
    
        const [tickets, totalCount] = await query.getManyAndCount();
        return {
            tickets,
            totalCount
        };
    }
    
 
    async createTicket(ticketRequest: TicketRequest): Promise<Ticket | null> {
        const validation = await this.validateTicketRequest(ticketRequest);
        if (!validation) return null;

        const { client, seance } = validation;
        const ticketRepo = this.db.getRepository(Ticket);

        const newTicket = ticketRepo.create({
            client,
            seance,
            type: ticketRequest.type,
            seatNumber: ticketRequest.seatNumber,
            isValid: ticketRequest.isValid ?? true
        });

        return await ticketRepo.save(newTicket);
    }

    async deleteTicket(id: number): Promise<void> {
        const ticketRepo = this.db.getRepository(Ticket);
        const ticketToDelete = await ticketRepo.findOneBy({ id });
        if (ticketToDelete) {
            await ticketRepo.remove(ticketToDelete);
        }
    }
}

