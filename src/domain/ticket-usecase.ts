import { DataSource } from "typeorm";
import { Ticket ,TicketType} from "../database/entities/ticket";
import { Client } from "../database/entities/client";
import { Seance } from "../database/entities/seance";
import { Transaction } from "../database/entities/Transaction";

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
    
 
    async createTicket(ticketRequest: TicketRequest): Promise<Ticket | string> {
        try {
             const validation = await this.validateTicketRequest(ticketRequest);
            if (!validation) return "Données de ticket invalides";
    
            const { client, seance } = validation;
    
             const ticketPrice = this.determineTicketPrice(ticketRequest.type, seance);
    
            if (client.balance < ticketPrice) {
                return "Solde insuffisant pour l'achat du billet";
            }
    
             const clientRepo = this.db.getRepository(Client);
            client.balance -= ticketPrice;
            await clientRepo.save(client);
    
             const transRepo = this.db.getRepository(Transaction);
            const transaction = transRepo.create({
                amount: ticketPrice,
                type: "ticket_purchase",
                client: client,
                createdAt: new Date()
            });
            await transRepo.save(transaction);
    
             const ticketRepo = this.db.getRepository(Ticket);
            const newTicket = ticketRepo.create({
                client,
                seance,
                type: ticketRequest.type,
                seatNumber: ticketRequest.seatNumber,
                isValid: ticketRequest.isValid ?? true,
                createdAt: new Date()
            });
    
            return await ticketRepo.save(newTicket);
        } catch (error) {
            console.error("Erreur lors de la création du billet:", error);
            return "Erreur interne du serveur";
        }
    }
    
     async validateTicketRequest(ticketRequest: TicketRequest): Promise<{client: Client, seance: Seance} | null> {
        const clientRepo = this.db.getRepository(Client);
        const client = await clientRepo.findOne({ where: { id: ticketRequest.clientId } });
        if (!client) {
            console.error("Client introuvable");
            return null;
        }
    
        const seanceRepo = this.db.getRepository(Seance);
        const seance = await seanceRepo.findOne({ where: { id: ticketRequest.seanceId } });
        if (!seance) {
            console.error("Séance introuvable");
            return null;
        }
    
        return { client, seance };
    }
    
    async deleteTicket(id: number): Promise<void> {
        const ticketRepo = this.db.getRepository(Ticket);
        const ticketToDelete = await ticketRepo.findOneBy({ id });
        if (ticketToDelete) {
            await ticketRepo.remove(ticketToDelete);
        }
    }

    determineTicketPrice(ticketType: TicketType, seance: Seance): number {
        const basePrice = 10;  
        let priceMultiplier = 1; 

        if (ticketType === TicketType.super) {
            priceMultiplier = 2; 
        }
    
         if (seance.starting.getHours() < 12) {
            priceMultiplier *= 0.8;  
        }
    
        return basePrice * priceMultiplier;
    }
    
}
