import Joi from "joi";
import { Eaccount } from "../../database/entities/eaccount";

export const transactionValidation = Joi.object<TransactionRequest>({
    eaccount:Joi.number().required(),
    amount: Joi.number().required(),
    type: Joi.string().valid('deposit', 'withdrawal').required(),
    autorization:Joi.required()
});

export interface TransactionRequest {
    eaccount: number;
    amount: number;
    type: 'deposit' | 'withdrawal';
    autorization:string
}

export const transactionIdValidation = Joi.object<TransactionIdRequest>({
    id: Joi.number().required(),
});

export interface TransactionIdRequest {
    id: number;
}
