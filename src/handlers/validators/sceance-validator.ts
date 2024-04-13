import Joi from "joi";
export const seanceValidation = Joi.object<SeanceRequest>({
    starting: Joi.date()
        .iso()
        .required(),
    ending:Joi.date()
        .iso()
        .optional(),
    room:Joi.number().required(),
    movie:Joi.number().required(),
    autorization:Joi.required()

}).options({ abortEarly: false })

export interface SeanceRequest {
    starting:Date,
    ending?:Date,
    room:number,
    movie:number,
    autorization:string

}
