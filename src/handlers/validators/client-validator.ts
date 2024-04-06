import Joi from "joi";

export const createClientValidation = Joi.object<CreateClientValidationRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
}).options({ abortEarly: false });

export interface CreateClientValidationRequest {
    email: string
    password: string
}



export const LoginClientValidation = Joi.object<LoginClientValidationRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}).options({ abortEarly: false });

export interface LoginClientValidationRequest {
    email: string
    password: string
}