import Joi from "joi";

export const createCoordinatorValidation = Joi.object<CreateCoordinatorValidationRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role:Joi.number().required()
}).options({ abortEarly: false });

export interface CreateCoordinatorValidationRequest {
    email: string
    password: string
    role:number
}
