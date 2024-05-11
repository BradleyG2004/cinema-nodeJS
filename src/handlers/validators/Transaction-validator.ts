import Joi from "joi";

export const transactionValidation = Joi.object<TransactionRequest>({
    amount: Joi.number().required(),
    type: Joi.string().valid('deposit', 'withdrawal', 'ticket_purchase').required(),
    clientId: Joi.number().required(),
});

export interface TransactionRequest {
    amount: number;
    type: 'deposit' | 'withdrawal' | 'ticket_purchase';
    clientId: number;
}

export const transactionIdValidation = Joi.object<TransactionIdRequest>({
    id: Joi.number().required(),
});

export interface TransactionIdRequest {
    id: number;
}
