import express, { Request, Response } from "express";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";
import { ClientHandler } from "./client";
import { invalidPathHandler } from "./errors/invalid-path-handler";
import { compare, hash } from "bcrypt";
import { Client } from "../database/entities/client";
import { Movie } from "../database/entities/movie";
import { LoginClientValidation, createClientValidation } from "./validators/client-validator";
import { sign } from "jsonwebtoken";
import { Token } from "../database/entities/token"
import { Coordinator } from "../database/entities/coordinator";
import { listMovieValidation, movieIdValidation, movieValidation, updateMovieValidation } from "./validators/movie-validator";
import { MovieUsecase } from "../domain/movie-usecase";
import { coordMiddleware } from "./middleware/coord-middleware";
import { listRoomValidation, roomIdValidation, roomValidation } from "./validators/room-validator";
import { Room } from "../database/entities/room";
import { RoomUsecase } from "../domain/room-usecase";

export const initRoutes = (app: express.Express) => {
    app.post('/clients/signup', async (req: Request, res: Response) => {
        // res.send({"req":req.body})
        try {

            const validationResult = createClientValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const createClientRequest = validationResult.value
            const hashedPassword = await hash(createClientRequest.password, 10);

            const clientRepository = AppDataSource.getRepository(Client)
            const client = await clientRepository.save({
                email: createClientRequest.email,
                password: hashedPassword
            }); 

            res.status(201).send({ id: client.id, email: client.email, createdAt: client.createdAt })
            return
        } catch (error) { 
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.post('/clients/login', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginClientValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginClientRequest = validationResult.value

            // valid client exist
            const client = await AppDataSource.getRepository(Client).findOneBy({ email: loginClientRequest.email });

            if (!client) {
                res.status(400).send({ error: "email or password not valid" })
                return
            }

            // valid password for this client
            const isValid = await compare(loginClientRequest.password, client.password);
            if (!isValid) {
                res.status(400).send({ error: "email or password not valid" })
                return
            }
            
            const secret = process.env.JWT_SECRET ?? "NoNotThis"
            console.log(secret)
            // generate jwt
            const token = sign({ clientId: client.id, email: client.email }, secret, { expiresIn: '1d' });
            // store un token pour un client
            await AppDataSource.getRepository(Token).save({ token: token, client: client })
            res.status(200).json({ token }).send({"message":"authenticated ✅"});
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.post('/coordinators/signup', async (req: Request, res: Response) => {
        // res.send({"req":req.body})
        try {

            const validationResult = createClientValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const createClientRequest = validationResult.value
            const hashedPassword = await hash(createClientRequest.password, 10);

            const clientRepository = AppDataSource.getRepository(Coordinator)
            const client = await clientRepository.save({
                email: createClientRequest.email,
                password: hashedPassword
            }); 

            res.status(201).send({ id: client.id, email: client.email, createdAt: client.createdAt })
            return
        } catch (error) { 
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return
        }
    })

    app.post('/coordinators/login', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginClientValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginCoordinatorRequest = validationResult.value

            // valid client exist
            const coordinator = await AppDataSource.getRepository(Coordinator).findOneBy({ email: loginCoordinatorRequest.email });

            if (!coordinator) {
                res.status(400).send({ error: "email or password not valid" })
                return
            }

            // valid password for this client
            const isValid = await compare(loginCoordinatorRequest.password, coordinator.password);
            if (!isValid) {
                res.status(400).send({ error: "email or password not valid" })
                return
            }
            
            const secret = process.env.JWT_SECRET ?? "NoNotThis"
            console.log(secret)
            // generate jwt
            const token = sign({ clientId: coordinator.id, email: coordinator.email }, secret, { expiresIn: '1d' });
            // store un token pour un client
            await AppDataSource.getRepository(Token).save({ token: token, coordinator: coordinator })
            res.status(200).json({ token }).send({"message":"authenticated ✅"});
        } catch (error) {
            console.log(error)
            res.status(500).send({ "error": "internal error retry later" })
            return 
        }
    })

    app.post("/movies", async (req: Request, res: Response) => {
        const validation = movieValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
 
        const MovieRequest = validation.value
        const MovieRepo = AppDataSource.getRepository(Movie)
        try {

            const MovieCreated = await MovieRepo.save(
                MovieRequest
            )
            res.status(201).send(MovieCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/movies", async (req: Request, res: Response) => {
        const validation = listMovieValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listMovieRequest = validation.value
        let limit = 20
        if (listMovieRequest.limit) {
            limit = listMovieRequest.limit
        }
        const page = listMovieRequest.page ?? 1

        try {
            const movieUsecase = new MovieUsecase(AppDataSource);
            const listmovies = await movieUsecase.listMovie({ ...listMovieRequest, page, limit })
            res.status(200).send(listmovies)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/movies/:id",  async (req: Request, res: Response) => {
        try {
            const validationResult = movieIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const movieId = validationResult.value

            const movieRepository = AppDataSource.getRepository(Movie)
            const movie = await movieRepository.findOneBy({ id: movieId.id })
            if (movie === null) {
                res.status(404).send({ "error": `movie ${movieId.id} not found` })
                return
            }
            res.status(200).send(movie)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.put("/movies/:id", coordMiddleware, async (req: Request, res: Response) => {

        const validation = updateMovieValidation.validate({ ...req.params, ...req.body })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        } 

        const updateMovieRequest = validation.value

        try {
            const movieUsecase = new MovieUsecase(AppDataSource);
            const updatedMovie = await movieUsecase.updateMovie(updateMovieRequest.id, { ...updateMovieRequest })
            if (updatedMovie === null) {
                res.status(404).send({ "error": `movie ${updateMovieRequest.id} not found` })
                return
            }
            res.status(200).send(updatedMovie)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.post("/rooms", coordMiddleware, async (req: Request, res: Response) => {
        const validation = roomValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
 
        const RoomRequest = validation.value
        const RoomRepo = AppDataSource.getRepository(Room)
        try {

            const RoomCreated = await RoomRepo.save(
                RoomRequest
            )
            res.status(201).send(RoomCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/rooms/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = roomIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const roomId = validationResult.value

            const roomRepository = AppDataSource.getRepository(Room)
            const room = await roomRepository.findOneBy({ id: roomId.id })
            if (room === null) {
                res.status(404).send({ "error": `room ${roomId.id} not found` })
                return
            }
            res.status(200).send(room) 
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}