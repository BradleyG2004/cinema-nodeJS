import Joi from "joi";
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateMovie:
 *       type: object
 *       required:
 *         - name
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom du film
 *         duration:
 *           type: number
 *           description: La duree en minutes
 *       example:
 *         name: Titanic
 *         price: 60
 */
export const movieValidation = Joi.object<MovieRequest>({
    name: Joi.string()
        .min(3)
        .required(),
    duration: Joi.number().required()
}).options({ abortEarly: false })

export interface MovieRequest {
    name: string
    duration:number
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
    name: Joi.string().min(3).optional(),
    duration: Joi.number().min(1).optional()
}).options({ abortEarly: false });

export interface UpdateMovieRequest {
    id: number;
    name?: string;
    duration?: number;
}