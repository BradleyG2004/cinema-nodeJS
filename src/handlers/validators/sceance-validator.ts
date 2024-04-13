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

export const seanceRoomValidation = Joi.object<SeanceRoomRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    from: Joi.date()
        .iso()
        .required(),
    to:Joi.date()
        .iso()
        .required(),
    roomid:Joi.number().required()

}).options({ abortEarly: false })

export interface SeanceRoomRequest {
    from:Date,
    to:Date,
    roomid:number,
    page?:number,
    limit?:number
}