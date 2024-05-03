import Joi, { StringRegexOptions } from "joi";
export const roomValidation = Joi.object<RoomRequest>({
    name: Joi.string()
        .min(3)
        .required(),
    description: Joi.string()
        .min(3)
        .optional(),
    type: Joi.string()
        .min(3)
        .optional(),
    state: Joi.boolean()
        .required(),
    capacity:Joi.number()
            .min(15)
            .max(30)
            .required(),
    accessibility: Joi.boolean()
            .required(),
}).options({ abortEarly: false })

export interface RoomRequest {
    name: string,
    description?:string,
    type?:string,
    state:boolean,
    capacity:number,
    accessibility:boolean

}


export const listRoomValidation = Joi.object<ListRoomRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional()
})


export interface ListRoomRequest {
    page?: number
    limit?: number
}

export const roomIdValidation = Joi.object<RoomIdRequest>({
    id: Joi.number().required(),
})

export interface RoomIdRequest {
    id: number
}

export const updateRoomValidation = Joi.object<UpdateRoomRequest>({
    id: Joi.number().required(),
    type:Joi.string(),
    name:Joi.string(),
    description:Joi.string(),
    capacity:Joi.number(),
    state:Joi.boolean(),
    accessibility: Joi.boolean(),
    authorization: Joi.string().required()

})

export interface UpdateRoomRequest {
    id: number
    type:string
    name: string
    state:boolean
    capacity: number
    description: string
    authorization:string
    accessibility: boolean
}