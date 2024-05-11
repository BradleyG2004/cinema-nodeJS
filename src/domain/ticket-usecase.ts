import { DataSource } from "typeorm";
import { Ticket ,TicketType} from "../database/entities/ticket";
import { Client } from "../database/entities/client";
import { Seance } from "../database/entities/seance";
import { Token } from "../database/entities/token";
import { Occupation } from "../database/entities/occupation";
import { Seat } from "../database/entities/seat";

export interface ListTicketFilter {
    limit: number;
    page: number;
}

export interface UpdateTicketParams {
    seatNumber?: number;
    isValid?: boolean;
}

export interface TicketRequest {
    autorization:string;
    clientId: number;
    seanceId: number;
    seatId: number;
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

    // async updateTicket(id: number, updateParams: UpdateTicketParams): Promise<Ticket | null> {
    //     const ticketRepo = this.db.getRepository(Ticket);
    //     const ticketFound = await ticketRepo.findOneBy({ id });
    //     if (!ticketFound) return null;

    //     if (updateParams.seatNumber !== undefined) {
    //         ticketFound.seatNumber = updateParams.seatNumber;
    //     }
    //     if (updateParams.isValid !== undefined) {
    //         ticketFound.isValid = updateParams.isValid;
    //     }

    //     const ticketUpdated = await ticketRepo.save(ticketFound);
    //     return ticketUpdated;
    // }

    async createTicket(ticketRequest: TicketRequest): Promise<Ticket | string | null> {
        // Récupération du token et du client
        const tokenRepo = this.db.getRepository(Token);
        const token = await tokenRepo.findOne({
            where: { token: ticketRequest.autorization },
            relations: ['client']
        });
        if (!token) return null;
        const client = token.client;
    
        // Récupération de la séance avec la salle associée
        const seanceRepo = this.db.getRepository(Seance);
        const seance = await seanceRepo.findOne({
            where: { id: ticketRequest.seanceId },
            relations: ['room']
        });
        if (!seance) return null;
    
        // Vérification de l'occupation de la place
        const occupationRepo = this.db.getRepository(Occupation);
        const isOccupied = await occupationRepo.findOne({
            where: {
                roomId: seance.room.id,
                seatId: ticketRequest.seatId,
                starting: seance.starting,
                ending: seance.ending
            }
        });
        if (isOccupied) {
            return "Veuillez changer de place pour cette seance ou de seance tout court";
        }
    
        // Création du ticket
        const ticket = new Ticket();
        ticket.client = client;
        ticket.isValid = true;
        ticket.roomId = seance.room.id;

        const SeatRepo = this.db.getRepository(Seat);
        const seatt = await SeatRepo.findOne({
            where: {
                id: ticketRequest.seatId
            },
            relations: ['room']
        });
        if(seatt){
            if(seatt.room.name!=seance.room.name){
                return " La seance et la place ne sont pas dans la meme salle "+seatt.room.name+"<\-room de la place,"+seance.room.name+"<\-room de la seance"
            }
        }
        ticket.seatId = ticketRequest.seatId;
        ticket.type = ticketRequest.type;
    
        // Enregistrement du ticket
        const ticketRepo = this.db.getRepository(Ticket);
        await ticketRepo.save(ticket);
    
        // Création de l'occupation
        const occupation = new Occupation();
        occupation.ticket = ticket;
        occupation.roomId = seance.room.id;
        occupation.seance = seance;
        occupation.ending = seance.ending;
        occupation.seatId = ticketRequest.seatId;
        occupation.starting = seance.starting;
    
        // Enregistrement de l'occupation
        await occupationRepo.save(occupation);
    
        return ticket;
    }
    

    async deleteTicket(id: number): Promise<void| string | number> {
        const ticketRepo = this.db.getRepository(Ticket);
        const ticketToDelete = await ticketRepo.findOneBy({ id });
        const OccRepo = this.db.getRepository(Occupation);
        const OccToDelete = await OccRepo.findOne({
            where: {
                roomId: ticketToDelete?.roomId,
                seatId: ticketToDelete?.seatId
            },
            relations: ['ticket']
        });
        // if (ticketToDelete){
        //     return "Successful operation"
        // }
        if(ticketToDelete && OccToDelete) {
            if(OccToDelete.ticket.id==ticketToDelete.id){
                await OccRepo.remove(OccToDelete);
                await ticketRepo.remove(ticketToDelete);
                return "Successful operation"
            }
            return "this is " +OccToDelete.ticket.id+" "
        }

        return " Try Again , an error occured ..."
    } 
}

