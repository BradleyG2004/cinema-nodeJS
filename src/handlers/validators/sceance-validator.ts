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





export const listSeanceValidation = Joi.object<ListSeanceRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional()
})


export interface ListSeanceRequest {
    page?: number
    limit?: number
}




export const seanceIdValidation = Joi.object<SeanceIdRequest>({
    id: Joi.number().required(),
})

export interface SeanceIdRequest {
    id: number
}


export const updateSeanceValidation= Joi.object<UpdateSeanceRequest>({
    id: Joi.number().required(),
    starting:Joi.date()
    .iso(),
    room:Joi.number(),
    movie:Joi.number(),
    authorization: Joi.string().required()

})

export interface UpdateSeanceRequest {
    id: number
    starting?:Date
    room?:number
    movie?:number
    authorization: string
}