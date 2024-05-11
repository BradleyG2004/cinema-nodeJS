import express, { Request, Response } from "express";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";
import { compare, hash } from "bcrypt";
import { Client } from "../database/entities/client";
import { Movie } from "../database/entities/movie";
import { LoginClientValidation, createClientValidation } from "./validators/client-validator";
import { sign } from "jsonwebtoken";
import { Token } from "../database/entities/token"
import { Coordinator } from "../database/entities/coordinator";
import { UpdateMovieRequest, listMovieValidation, movieIdValidation, movieValidation, updateMovieValidation } from "./validators/movie-validator";
import { MovieUsecase, UpdateMovieParams } from "../domain/movie-usecase";
import { coordMiddleware } from "./middleware/coord-middleware";
import { listRoomValidation, roomIdValidation, roomValidation, updateRoomValidation } from "./validators/room-validator";
import { Room } from "../database/entities/room";
import { RoomUsecase } from "../domain/room-usecase";
import { createCoordinatorValidation } from "./validators/coordinator-validator";
import { Role } from "../database/entities/role";
import { listSeanceValidation, seanceRoomValidation, seanceValidation } from "./validators/sceance-validator";
import { SeanceUsecase } from "../domain/seance-usecase";
import { combMiddleware } from "./middleware/comb-middleware";
import { TicketIdRequest, TicketRequest, listTicketValidation, ticketIdValidation, ticketValidation, updateTicketValidation } from "./validators/ticket-validator";
import { Ticket } from "../database/entities/ticket";
import { SeatIdRequest, SeatRequest, listSeatValidation, seatIdValidation, seatValidation, updateSeatValidation } from "./validators/seat-validator";
import { SeatUsecase } from "../domain/seat-usecase";
import { Seat } from "../database/entities/seat";
import { TicketUsecase } from "../domain/ticket-usecase";

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

 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    app.post('/coordinators/signup', async (req: Request, res: Response) => {
        // res.send({"req":req.body})
        try {

            const validationResult = createCoordinatorValidation.validate(req.body)
            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const createCoordinatorRequest = validationResult.value
            const RoleRepository = AppDataSource.getRepository(Role)
            const role = await RoleRepository.findOneBy({ id: createCoordinatorRequest.role })
            if (role === null) {
                res.status(404).send({ "error": `role ${createCoordinatorRequest.role} not found` })
                return
            }
            const hashedPassword = await hash(createCoordinatorRequest.password, 10);
            const coordinatorRepository = AppDataSource.getRepository(Coordinator)
            const coordinator = await coordinatorRepository.save({
                email: createCoordinatorRequest.email,
                password: hashedPassword,
                role:role,
            });  
            // res.send(typeof createCoordinatorRequest.role)
            res.status(201).send({ id: coordinator.id, email: coordinator.email, roleId:coordinator.role, createdAt: coordinator.createdAt })
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
            
            const secret = process.env.JWT_SECRET ?? "NoNotThiss"
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



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.post("/movies", coordMiddleware, async (req: Request, res: Response) => {
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
    app.get("/movies", combMiddleware, async (req: Request, res: Response) => {
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
    app.get("/movies/:id", combMiddleware, async (req: Request, res: Response) => {
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
    app.patch("/movies/:id", async (req: Request, res: Response) => {
        const validation = updateMovieValidation.validate({ ...req.params, ...req.body });
        const movieUsecase = new MovieUsecase(AppDataSource);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
        const updateMovieRequest: UpdateMovieRequest = validation.value;
        try {
            const movieUpdated = await movieUsecase.updateMovie(updateMovieRequest.id, updateMovieRequest);
            if (!movieUpdated) {
                res.status(404).send({ error: `Movie ${updateMovieRequest.id} not found` });
                return;
            }
            res.status(200).send(movieUpdated);
        } catch (error: any) {
            console.error("Internal error:", error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 
    app.post("/tickets", coordMiddleware, async (req: Request, res: Response) => {
        const validation = ticketValidation.validate({ ...req.params, ...req.body,autorization: req.headers.authorization?.split(" ")[1]})
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
 
        const ticketRequest: TicketRequest = validation.value;

        try {
            const ticketUsecase = new TicketUsecase(AppDataSource);
            const ticketCreated = await ticketUsecase.createTicket(ticketRequest);
            if (!ticketCreated) {
                res.status(404).send("Client or Seance not found");
            } 
            res.status(404).send(ticketCreated);
        }catch(error){
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    
    });
    app.get("/tickets", combMiddleware, async (req: Request, res: Response) => {
        const validation = listTicketValidation.validate(req.query);
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const listTicketRequest = validation.value;
        let limit = 20; // Default limit
        if (listTicketRequest.limit) {
            limit = listTicketRequest.limit;
        }
        const page = listTicketRequest.page ?? 1;
    
        try {
            const ticketUsecase = new TicketUsecase(AppDataSource);
            const tickets = await ticketUsecase.listTickets({ page, limit });
            res.status(200).send(tickets);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.get("/tickets/:id", combMiddleware, async (req: Request, res: Response) => {
        const validationResult = ticketIdValidation.validate(req.params);
    
        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }
    
        const ticketId = validationResult.value.id;
        const ticketRepo = AppDataSource.getRepository(Ticket);
        try {
            const ticket = await ticketRepo.findOneBy({ id: ticketId });
            if (!ticket) {
                res.status(404).send({ error: `Ticket ${ticketId} not found` });
                return;
            }
            res.status(200).send(ticket);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.put("/tickets/:id", coordMiddleware, async (req: Request, res: Response) => {
        const validation = updateTicketValidation.validate({ ...req.params, ...req.body });
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const updateTicketRequest = validation.value;
        const ticketRepo = AppDataSource.getRepository(Ticket);
        try {
            const ticket = await ticketRepo.findOneBy({ id: updateTicketRequest.id });
            if (!ticket) {
                res.status(404).send({ error: `Ticket ${updateTicketRequest.id} not found` });
                return;
            }
    
            if (updateTicketRequest.seatNumber !== undefined) {
                ticket.seatId= updateTicketRequest.seatNumber;
            }
            if (updateTicketRequest.isValid !== undefined) {
                ticket.isValid = updateTicketRequest.isValid;
            }
            if (updateTicketRequest.type !== undefined) {
                ticket.type = updateTicketRequest.type;
            }
            const updatedTicket = await ticketRepo.save(ticket);
            res.status(200).send(updatedTicket);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.delete("/tickets/:id", combMiddleware, async (req: Request, res: Response) => {
        const validationResult = ticketIdValidation.validate(req.params);
    
        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }
        const ticketUsecase = new TicketUsecase(AppDataSource);

        const ticketId: TicketIdRequest  = validationResult.value;
    
        try {
            res.status(200).send(await ticketUsecase.deleteTicket(ticketId.id));
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    
    app.post("/seats", coordMiddleware, async (req: Request, res: Response) => {
        const validation = seatValidation.validate(req.body);
        const seatUsecase = new SeatUsecase(AppDataSource);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const seatRequest: SeatRequest = validation.value;
    
        try {
            const seatCreated = await seatUsecase.createSeat(seatRequest);
            res.status(201).send(seatCreated);
        } catch (error: any) {
            if (error.message.includes("has reached its maximum capacity")) {
                res.status(409).send({ error: error.message });
            } else {
                res.status(500).send({ error: "Internal error" });
            }
        }
    });
    app.get("/seats", combMiddleware, async (req: Request, res: Response) => {
        const validation = listSeatValidation.validate(req.query);
        const seatUsecase = new SeatUsecase(AppDataSource);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const listSeatRequest = validation.value;
        let limit = 20; // Default limit
        if (listSeatRequest.limit) {
            limit = listSeatRequest.limit;
        }
        const page = listSeatRequest.page ?? 1;
    
        try {
            const seats = await seatUsecase.listSeats({ page, limit });
            res.status(200).send(seats);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.get("/seats/:id", combMiddleware, async (req: Request, res: Response) => {
        const validationResult = seatIdValidation.validate(req.params);
    
        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }
    
        const seatId: SeatIdRequest = validationResult.value;
        const seatRepo = AppDataSource.getRepository(Seat);
    
        try {
            const seat = await seatRepo.findOneBy({ id: seatId.id });
            if (!seat) {
                res.status(404).send({ error: `Seat ${seatId.id} not found` });
                return;
            }
            res.status(200).send(seat);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.patch("/seats/:id", coordMiddleware, async (req: Request, res: Response) => {
        const validation = updateSeatValidation.validate({ ...req.params, ...req.body });
    
        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const updateSeatRequest = validation.value;
        const seatUsecase = new SeatUsecase(AppDataSource);

        try {
            const seatUpdated = await seatUsecase.updateSeat(updateSeatRequest.id, updateSeatRequest);
            if (!seatUpdated) {
                res.status(404).send({ error: `Seat ${updateSeatRequest.id} not found` });
                return;
            }
            res.status(200).send(seatUpdated);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    app.delete("/seats/:id", coordMiddleware, async (req: Request, res: Response) => {
        const validationResult = seatIdValidation.validate(req.params);
    
        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }
        const seatUsecase = new SeatUsecase(AppDataSource);

        const seatId: SeatIdRequest = validationResult.value;
    
        try {
            res.status(200).send(await seatUsecase.deleteSeat(seatId.id));
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





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

    app.get("/rooms",combMiddleware,async (req: Request, res: Response) => {
        const validation = listRoomValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
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
            res.status(200).send(listrooms)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/rooms/:id",combMiddleware,async (req: Request, res: Response) => {
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

    app.patch("/rooms/:id",  coordMiddleware, async (req: Request, res: Response) => {

        const validation = updateRoomValidation.validate({ ...req.params, ...req.body,authorization: req.headers.authorization?.split(" ")[1]})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }
        const updateRoomRequest = validation.value

        try {
            const roomUsecase = new RoomUsecase(AppDataSource);
            const updatedRoom = await roomUsecase.updateRoom(updateRoomRequest.id, updateRoomRequest.authorization,{ ...updateRoomRequest })
            if (updatedRoom === null) {
                res.status(404).send({ "error": `room ${updateRoomRequest.id} not found` })
                return
            }
            res.status(200).send(updatedRoom)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/rooms/:id",  coordMiddleware, async (req: Request, res: Response) => {
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

            const roomDeleted = await roomRepository.remove(room)
            res.status(200).send(roomDeleted)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    app.post("/seance",  coordMiddleware, async (req: Request, res: Response) => {
        const validation = seanceValidation.validate({ ...req.params, ...req.body,autorization: req.headers.authorization?.split(" ")[1]})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const seanceRequest = validation.value
        try {
            const seanceUsecase = new SeanceUsecase(AppDataSource);
            const seanceCreated = await seanceUsecase.createSeance(seanceRequest.starting, seanceRequest.room,seanceRequest.movie,seanceRequest.autorization)
            res.status(201).send(seanceCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    })

    app.get("/seance/:roomid",  combMiddleware,async (req: Request, res: Response) => {
        
            const validationResult = seanceRoomValidation.validate({...req.params,...req.body})

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
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
                res.status(200).send(listseances)
            } catch (error) {
                console.log(error)
                res.status(500).send({ error: "Internal error" })
            }
    })  

    app.get("/seance",combMiddleware,async (req: Request, res: Response) => {
        const validation = listSeanceValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
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
            res.status(200).send(listrooms)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }

    })
} 