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
import { listRoomValidation, roomIdValidation, roomValidation, updateRoomValidation } from "./validators/room-validator";
import { Room } from "../database/entities/room";
import { RoomUsecase } from "../domain/room-usecase";
import { Seance } from "../database/entities/seance";
import { createCoordinatorValidation } from "./validators/coordinator-validator";
import { Role } from "../database/entities/role";
import { type } from "os";
import { listSeanceValidation, seanceIdValidation, seanceRoomValidation, seanceValidation, updateSeanceValidation } from "./validators/sceance-validator";
import { SeanceUsecase } from "../domain/seance-usecase";
import { combMiddleware } from "./middleware/comb-middleware";

export const initRoutes = (app: express.Express) => {
    /**
     * @openapi
     * /movies:
     *   post:
     *     tags:
     *       - Movies
     *     summary: Create a new Movie
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 minLength: 3
     *               duration:
     *                 type: number
     *             required:
     *               - name
     *               - duration
     *     responses:
     *       '201':
     *         description: Movie created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/database/entities/movie'
     *       '400':
     *         description: Bad request
     *       '500':
     *         description: Internal Error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: error message
     *               example:
     *                 error: 'Internal error'
     */

    app.post('/clients/signup', async (req: Request, res: Response) => {
        // res.json({"req":req.body})
        try {

            const validationResult = createClientValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const createClientRequest = validationResult.value
            const hashedPassword = await hash(createClientRequest.password, 10);

            const clientRepository = AppDataSource.getRepository(Client)
            const client = await clientRepository.save({
                email: createClientRequest.email,
                password: hashedPassword
            }); 

            res.status(201).json({ id: client.id, email: client.email, createdAt: client.createdAt })
            return
        } catch (error) { 
            console.log(error)
            res.status(500).json({ "error": "internal error retry later" })
            return
        }
    })

    app.post('/clients/login', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginClientValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginClientRequest = validationResult.value

            // valid client exist
            const client = await AppDataSource.getRepository(Client).findOneBy({ email: loginClientRequest.email });

            if (!client) {
                res.status(400).json({ error: "email or password not valid" })
                return
            }

            // valid password for this client
            const isValid = await compare(loginClientRequest.password, client.password);
            if (!isValid) {
                res.status(400).json({ error: "email or password not valid" })
                return
            }
            
            const secret = process.env.JWT_SECRET ?? "NoNotThis"
            //console.log(secret)
            // generate jwt
            const token = sign({ clientId: client.id, email: client.email }, secret, { expiresIn: '1d' });
            // store un token pour un client
            await AppDataSource.getRepository(Token).save({ token: token, client: client })
            res.status(200).json({ token, message: "authenticated ✅" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ "error": "internal error retry later" })
            return
        }
    })

 


    app.post('/coordinators/signup', async (req: Request, res: Response) => {
        // res.json({"req":req.body})
        try {

            const validationResult = createCoordinatorValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const createCoordinatorRequest = validationResult.value
            const RoleRepository = AppDataSource.getRepository(Role)
            const role = await RoleRepository.findOneBy({ id: createCoordinatorRequest.role })
            if (role === null) {
                res.status(404).json({ "error": `role ${createCoordinatorRequest.role} not found` })
                return
            }
            const hashedPassword = await hash(createCoordinatorRequest.password, 10);
            const coordinatorRepository = AppDataSource.getRepository(Coordinator)
            const coordinator = await coordinatorRepository.save({
                email: createCoordinatorRequest.email,
                password: hashedPassword,
                role:role,
            });  
            // res.json(typeof createCoordinatorRequest.role)
            res.status(201).json({ id: coordinator.id, email: coordinator.email, roleId:coordinator.role, createdAt: coordinator.createdAt })
            return
        } catch (error) { 
            console.log(error)
            res.status(500).json({ "error": "internal error retry later" })
            return
        }
    })

    app.post('/coordinators/login', async (req: Request, res: Response) => {
        try {

            const validationResult = LoginClientValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const loginCoordinatorRequest = validationResult.value

            // valid client exist
            const coordinator = await AppDataSource.getRepository(Coordinator).findOneBy({ email: loginCoordinatorRequest.email });

            if (!coordinator) {
                res.status(400).json({ error: "email or password not valid" })
                return
            }

            // valid password for this client
            const isValid = await compare(loginCoordinatorRequest.password, coordinator.password);
            if (!isValid) {
                res.status(400).json({ error: "email or password not valid" })
                return
            }
            
            const secret = process.env.JWT_SECRET ?? "NoNotThiss"
            //console.log(secret)
            // generate jwt
            const token = sign({ clientId: coordinator.id, email: coordinator.email }, secret, { expiresIn: '1d' });
            // store un token pour un client
            await AppDataSource.getRepository(Token).save({ token: token, coordinator: coordinator })
            res.status(200).json({ token, message: "authenticated ✅" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ "error": "internal error retry later" })
            return 
        }
    })




    app.post("/movies", async (req: Request, res: Response) => {
        const validation = movieValidation.validate(req.body)

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        }
 
        const MovieRequest = validation.value
        const MovieRepo = AppDataSource.getRepository(Movie)
        try {

            const MovieCreated = await MovieRepo.save(
                MovieRequest
            )
            res.status(201).json(MovieCreated)
        } catch (error) {
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.get("/movies", async (req: Request, res: Response) => {
        const validation = listMovieValidation.validate(req.query)

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
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
            res.status(200).json(listmovies)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.get("/movies/:id",  async (req: Request, res: Response) => {
        try {
            const validationResult = movieIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const movieId = validationResult.value

            const movieRepository = AppDataSource.getRepository(Movie)
            const movie = await movieRepository.findOneBy({ id: movieId.id })
            if (movie === null) {
                res.status(404).json({ "error": `movie ${movieId.id} not found` })
                return
            }
            res.status(200).json(movie)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.put("/movies/:id", coordMiddleware, async (req: Request, res: Response) => {

        const validation = updateMovieValidation.validate({ ...req.params, ...req.body })

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        } 

        const updateMovieRequest = validation.value

        try {
            const movieUsecase = new MovieUsecase(AppDataSource);
            const updatedMovie = await movieUsecase.updateMovie(updateMovieRequest.id, { ...updateMovieRequest })
            if (updatedMovie === null) {
                res.status(404).json({ "error": `movie ${updateMovieRequest.id} not found` })
                return
            }
            res.status(200).json(updatedMovie)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })




    app.post("/rooms", coordMiddleware, async (req: Request, res: Response) => {
        const validation = roomValidation.validate(req.body)

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        }
 
        const RoomRequest = validation.value
        const RoomRepo = AppDataSource.getRepository(Room)
        try {

            const RoomCreated = await RoomRepo.save(
                RoomRequest
            )
            res.status(201).json(RoomCreated)
        } catch (error) {
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.get("/rooms",combMiddleware,async (req: Request, res: Response) => {
        const validation = listRoomValidation.validate(req.query)

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listRoomRequest = validation.value
        let limit = 20
        if (listRoomRequest.limit) {
            limit = listRoomRequest.limit
        }
        const page = listRoomRequest.page ?? 1

        try {
            const roomUsecase = new RoomUsecase(AppDataSource);
            const listrooms = await roomUsecase.listRoom({ ...listRoomRequest, page, limit })
            res.status(200).json(listrooms)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.get("/rooms/:id",combMiddleware,async (req: Request, res: Response) => {
        try {
            const validationResult = roomIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const roomId = validationResult.value

            const roomRepository = AppDataSource.getRepository(Room)
            const room = await roomRepository.findOneBy({ id: roomId.id })
            if (room === null) {
                res.status(404).json({ "error": `room ${roomId.id} not found` })
                return
            }
            res.status(200).json(room) 
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.patch("/rooms/:id",  coordMiddleware, async (req: Request, res: Response) => {

        const validation = updateRoomValidation.validate({ ...req.params, ...req.body,authorization: req.headers.authorization?.split(" ")[1]})

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        }
        const updateRoomRequest = validation.value

        try {
            const roomUsecase = new RoomUsecase(AppDataSource);
            const updatedRoom = await roomUsecase.updateRoom(updateRoomRequest.id, updateRoomRequest.authorization,{ ...updateRoomRequest })
            if (updatedRoom === null) {
                res.status(404).json({ "error": `room ${updateRoomRequest.id} not found` })
                return
            }
            res.status(200).json(updatedRoom)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.delete("/rooms/:id",  coordMiddleware, async (req: Request, res: Response) => {
        try {
            const validationResult = roomIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const roomId = validationResult.value

            const roomRepository = AppDataSource.getRepository(Room)
            const room = await roomRepository.findOneBy({ id: roomId.id })
            if (room === null) {
                res.status(404).json({ "error": `room ${roomId.id} not found` })
                return
            }

            const roomDeleted = await roomRepository.remove(room)
            res.status(200).json(roomDeleted)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.get("/rooms/:roomid/planning",  combMiddleware,async (req: Request, res: Response) => {
        
        const validationResult = seanceRoomValidation.validate({...req.params,...req.body})

        if (validationResult.error) {
            res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
            return
        }
        const rech = validationResult.value
        let limit = 20
        if (rech.limit) {
            limit = rech.limit
        }
        const page = rech.page ?? 1
        try {
            const seanceUsecase = new SeanceUsecase(AppDataSource);
            const listseances = await seanceUsecase.listseance({ ...rech, page, limit })
            res.status(200).json(listseances)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
}) 




    app.post("/seances",coordMiddleware, async (req: Request, res: Response) => {
        const validation = seanceValidation.validate({ ...req.params, ...req.body,autorization: req.headers.authorization?.split(" ")[1]})

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        }

        const seanceRequest = validation.value
        try {
            const seanceUsecase = new SeanceUsecase(AppDataSource);
            const seanceCreated = await seanceUsecase.createSeance(seanceRequest.starting, seanceRequest.room,seanceRequest.movie,seanceRequest.autorization)
            res.status(201).json(seanceCreated)
        } catch (error) {
            res.status(500).json({ error: "Internal error" })
        }

    })  

    app.get("/seances",combMiddleware,async (req: Request, res: Response) => {
        const validation = listSeanceValidation.validate(req.query)

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listSeanceRequest = validation.value
        let limit = 20
        if (listSeanceRequest.limit) {
            limit = listSeanceRequest.limit
        }
        const page = listSeanceRequest.page ?? 1

        try {
            const seanceUsecase = new SeanceUsecase(AppDataSource);
            const listrooms = await seanceUsecase.listSeance({ ...listSeanceRequest, page, limit })
            res.status(200).json(listrooms)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }

    })

    app.get("/seances/:id",combMiddleware,async (req: Request, res: Response) => {
        try {
            const validationResult = seanceIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const seanceId = validationResult.value

            const seanceRepository = AppDataSource.getRepository(Seance)
            const seance = await seanceRepository.findOneBy({ id: seanceId.id })
            if (seance === null) {
                res.status(404).json({ "error": `seance ${seanceId.id} not found` })
                return
            }
            res.status(200).json(seance) 
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.patch("/seances/:id",  coordMiddleware, async (req: Request, res: Response) => {

        const validation = updateSeanceValidation.validate({ ...req.params, ...req.body,authorization: req.headers.authorization?.split(" ")[1]})

        if (validation.error) {
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        }
        const updateSeanceRequest = validation.value

        try {
            const seanceUsecase = new SeanceUsecase(AppDataSource);
            const updatedSeance = await seanceUsecase.updateSeance(updateSeanceRequest.id, updateSeanceRequest.authorization,{ ...updateSeanceRequest })
            if (updatedSeance === null) {
                res.status(404).json({ "error": `seance ${updateSeanceRequest.id} not found` })
                return
            }
            res.status(200).json(updatedSeance)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })

    app.delete("/seances/:id",coordMiddleware, async (req: Request, res: Response) => {
        try {
            const validationResult = seanceIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).json(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const seanceId = validationResult.value

            const seanceRepository = AppDataSource.getRepository(Seance)
            const seance = await seanceRepository.findOneBy({ id: seanceId.id })
            if (seance === null) {
                res.status(404).json({ "error": `seance ${seanceId.id} not found` })
                return
            }

            const seanceDeleted = await seanceRepository.remove(seance)
            res.status(200).json(seanceDeleted)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal error" })
        }
    })
} 