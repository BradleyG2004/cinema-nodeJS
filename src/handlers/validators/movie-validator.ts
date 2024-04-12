import Joi from "joi";
export const movieValidation = Joi.object<MovieRequest>({
    name: Joi.string()
        .min(3)
        .required(),
}).options({ abortEarly: false })

export interface MovieRequest {
    name: string
}



export const listMovieValidation = Joi.object<ListMovieRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional()
})


export interface ListMovieRequest {
    page?: number
    limit?: number
}


export const movieIdValidation = Joi.object<MovieIdRequest>({
    id: Joi.number().required(),
})

export interface MovieIdRequest {
    id: number
}


export const updateMovieValidation = Joi.object<UpdateMovieRequest>({
    id: Joi.number().required(),
    name: Joi.string()
    .min(3)
    .required()
})

export interface UpdateMovieRequest {
    id: number
    name: string
}