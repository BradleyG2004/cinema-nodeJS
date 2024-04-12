import Joi from "joi";
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