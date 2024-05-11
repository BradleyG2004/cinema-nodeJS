import Joi from "joi";
import { TicketType } from "../../database/entities/ticket";




export const ticketValidation = Joi.object<TicketRequest>({ 
    autorization:Joi.string().required(),
    seanceId: Joi.number().required(),
    seatId: Joi.number().required(),
    type: Joi.string().valid('NORMAL', 'SUPER').required()
}).options({ abortEarly: false });

export interface TicketRequest {
    autorization:string;
    clientId: number;
    seanceId: number;
    seatId: number;
    type: TicketType;
}




export const listTicketValidation = Joi.object<ListTicketRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional()
});

export interface ListTicketRequest {
    page?: number;
    limit?: number;
}
export const ticketIdValidation = Joi.object<TicketIdRequest>({
    id: Joi.number().required(),
});

export interface TicketIdRequest {
    id: number;
}
export const updateTicketValidation = Joi.object<UpdateTicketRequest>({
    id: Joi.number().required(),
    seatNumber: Joi.number().optional(),
    isValid: Joi.boolean().optional(),
    type: Joi.string().valid('NORMAL', 'SUPER').required()
});

export interface UpdateTicketRequest {
    id: number;
    seatNumber?: number;
    isValid?: boolean;
    type?: TicketType;
}
