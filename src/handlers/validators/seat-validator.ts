import Joi from "joi";
import { SeatType } from "../../database/entities/seat";
 
export const seatValidation = Joi.object<SeatRequest>({
    type: Joi.string().valid(SeatType.regular, SeatType.premium, SeatType.vip).required(),
    roomId: Joi.number().required()
}).options({ abortEarly: false });

export interface SeatRequest {
    type: SeatType;
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
    type: Joi.string().valid(SeatType.regular, SeatType.premium, SeatType.vip).optional()
});

export interface UpdateSeatRequest {
    id: number;
    type?: SeatType;
    isAvailable?: boolean;
}
