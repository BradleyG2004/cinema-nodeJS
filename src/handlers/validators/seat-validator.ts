import Joi from "joi";
import { SeatType } from "../../database/entities/seat";
 
export const seatValidation = Joi.object<SeatRequest>({
    row: Joi.string().required(),
    number: Joi.number().required(),
    type: Joi.string().valid(SeatType.regular, SeatType.premium, SeatType.vip).required(),
    isAvailable: Joi.boolean().optional(),
    roomId: Joi.number().required()
}).options({ abortEarly: false });

export interface SeatRequest {
    row: string;
    number: number;
    type: SeatType;
    isAvailable?: boolean;
    roomId: number;
}

export const listSeatValidation = Joi.object<ListSeatRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional()
});

export interface ListSeatRequest {
    page?: number;
    limit?: number;
}

export const seatIdValidation = Joi.object<SeatIdRequest>({
    id: Joi.number().required(),
});

export interface SeatIdRequest {
    id: number;
}

export const updateSeatValidation = Joi.object<UpdateSeatRequest>({
    id: Joi.number().required(),
    row: Joi.string().optional(),
    number: Joi.number().optional(),
    type: Joi.string().valid(SeatType.regular, SeatType.premium, SeatType.vip).optional(),
    isAvailable: Joi.boolean().optional(),
    roomId: Joi.number().optional()
});

export interface UpdateSeatRequest {
    id: number;
    row?: string;
    number?: number;
    type?: SeatType;
    isAvailable?: boolean;
    roomId?: number;
}
