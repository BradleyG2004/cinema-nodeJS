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
import { UpdateMovieRequest, listMovieValidation, movieIdValidation, movieValidation, updateMovieValidation } from "./validators/movie-validator";
import { MovieUsecase, UpdateMovieParams } from "../domain/movie-usecase";
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
import { TicketRequest, listTicketValidation, ticketIdValidation, ticketValidation, updateTicketValidation } from "./validators/ticket-validator";
import { Ticket } from "../database/entities/ticket";
import { TicketUsecase } from "../domain/ticket-usecase";
import { SeatIdRequest, SeatRequest, listSeatValidation, seatIdValidation, seatValidation, updateSeatValidation } from "./validators/seat-validator";
import { SeatUsecase } from "../domain/seat-usecase";
import { Seat } from "../database/entities/seat";

export const initRoutes = (app: express.Express) => {
  
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

 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
 
/**
 * @openapi
 * /movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: List all movies
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number of the movies list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of movies to return per page
 *     responses:
 *       200:
 *         description: An array of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

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
    /**
 * @openapi
 * /movies/{id}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get a specific movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to retrieve
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */


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
    /**
 * @openapi
 * /movies/{id}:
 *   put:
 *     tags:
 *       - Movies
 *     summary: Update a specific movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMovieRequest'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *       409:
 *         description: Scheduling conflict with associated seances
 */

    app.put("/movies/:id", async (req: Request, res: Response) => {
        const validation = updateMovieValidation.validate({ ...req.params, ...req.body });
        const movieUsecase = new MovieUsecase(AppDataSource);

        if (validation.error) {
 
            res.status(400).json(generateValidationErrorMessage(validation.error.details))
            return
        } 

        const updateMovieRequest = validation.value

        try {
            const movieUpdated = await movieUsecase.updateMovie(updateMovieRequest.id, updateMovieRequest);
            if (!movieUpdated) {
                res.status(404).send({ error: `Movie ${updateMovieRequest.id} not found` });
                return;
            }
            res.status(200).send(movieUpdated);
        } catch (error: any) {
            if (error.message.includes("Les séances suivantes ne respectent pas")) {
                res.status(409).send({ error: error.message });
            } else {
                res.status(500).send({ error: "Internal error" });
            }
        }
            return;
         
    
     
    });
    /**
 * @openapi
 * /movies/{id}:
 *   delete:
 *     tags:
 *       - Movies
 *     summary: Delete a specific movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to delete
 *     responses:
 *       204:
 *         description: Movie successfully deleted
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */

    app.delete("/movies/:id", async (req: Request, res: Response) => {
        const movieId = parseInt(req.params.id);
        const movieRepository = AppDataSource.getRepository(Movie);
    
        try {
            const movieToDelete = await movieRepository.findOneBy({ id: movieId });
            if (!movieToDelete) {
                return res.status(404).send({ error: `Movie with ID ${movieId} not found` });
            }
    
            await movieRepository.remove(movieToDelete);
            res.status(204).send(); // No Content
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 /**
 * @openapi
 * /tickets:
 *   post:
 *     tags:
 *       - Tickets
 *     summary: Create a new ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketRequest'
 *     responses:
 *       201:
 *         description: Ticket successfully created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client or Seance not found
 *       500:
 *         description: Internal server error
 */

app.post("/tickets", async (req: Request, res: Response) => {
    const validation = ticketValidation.validate(req.body);
    const ticketUsecase = new TicketUsecase(AppDataSource);
    if (validation.error) {
        res.status(400).send(generateValidationErrorMessage(validation.error.details));
        return;
    }

    const ticketRequest: TicketRequest = validation.value;

    try {
        const ticketCreated = await ticketUsecase.createTicket(ticketRequest);
        if (!ticketCreated) {
            res.status(404).send("Client or Seance not found");
            return;
        } }
        
        catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal error" });
        }
   
});

/**
 * @openapi
 * /tickets:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: List all tickets
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number of the ticket list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of tickets to return per page
 *     responses:
 *       200:
 *         description: An array of tickets
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

    
    app.get("/tickets", async (req: Request, res: Response) => {
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
    /**
 * @openapi
 * /tickets/{id}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Get a specific ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the ticket to retrieve
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

    app.get("/tickets/:id", async (req: Request, res: Response) => {
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
    /**
 * @openapi
 * /tickets/{id}:
 *   put:
 *     tags:
 *       - Tickets
 *     summary: Update a specific ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the ticket to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicketRequest'
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       404:
 *         description: Ticket not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

    app.put("/tickets/:id", async (req: Request, res: Response) => {
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
                ticket.seatNumber = updateTicketRequest.seatNumber;
            }
            if (updateTicketRequest.isValid !== undefined) {
                ticket.isValid = updateTicketRequest.isValid;
            }
    
            const updatedTicket = await ticketRepo.save(ticket);
            res.status(200).send(updatedTicket);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
    /**
 * @openapi
 * /tickets/{id}:
 *   delete:
 *     tags:
 *       - Tickets
 *     summary: Delete a specific ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the ticket to delete
 *     responses:
 *       204:
 *         description: Ticket successfully deleted
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error
 */

    app.delete("/tickets/:id", async (req: Request, res: Response) => {
        const ticketId = parseInt(req.params.id);
        const ticketRepository = AppDataSource.getRepository(Ticket);
    
        try {
            const ticketToDelete = await ticketRepository.findOneBy({ id: ticketId });
            if (!ticketToDelete) {
                return res.status(404).send({ error: `Ticket with ID ${ticketId} not found` });
            }
    
            await ticketRepository.remove(ticketToDelete);
            res.status(204).send(); // No Content
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    });
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /**
 * @openapi
 * /seats:
 *   post:
 *     tags:
 *       - Seats
 *     summary: Create a new seat in a specified room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeatRequest'
 *     responses:
 *       201:
 *         description: Seat successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seat'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Room not found
 *       409:
 *         description: Room has reached its maximum capacity
 *       500:
 *         description: Internal server error
 */

   
    app.post("/seats", async (req: Request, res: Response) => {
        const validation = seatValidation.validate(req.body);
        const seatUsecase = new SeatUsecase(AppDataSource);

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details));
            return;
        }
    
        const seatRequest: SeatRequest = validation.value;
    
        try {
            const seatCreated = await seatUsecase.createSeat(seatRequest);
            if (!seatCreated) {
                res.status(404).send("Room not found");
                return;
            }
            res.status(201).send(seatCreated);
        } catch (error: any) {
            if (error.message.includes("has reached its maximum capacity")) {
                res.status(409).send({ error: error.message });
            } else {
                res.status(500).send({ error: "Internal error" });
            }
        }
    });
    /**
 * @openapi
 * /seats:
 *   get:
 *     tags:
 *       - Seats
 *     summary: List all seats
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number of the seats list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of seats to return per page
 *     responses:
 *       200:
 *         description: A list of seats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seat'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

    app.get("/seats", async (req: Request, res: Response) => {
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
    /**
 * @openapi
 * /seats/{id}:
 *   get:
 *     tags:
 *       - Seats
 *     summary: Get a specific seat by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seat to retrieve
 *     responses:
 *       200:
 *         description: Seat found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seat'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Internal server error
 */

    app.get("/seats/:id", async (req: Request, res: Response) => {
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
    /**
 * @openapi
 * /seats/{id}:
 *   put:
 *     tags:
 *       - Seats
 *     summary: Update a specific seat by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seat to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSeatRequest'
 *     responses:
 *       200:
 *         description: Seat successfully updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Internal server error
 */

    app.put("/seats/:id", async (req: Request, res: Response) => {
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
    /**
 * @openapi
 * /seats/{id}:
 *   delete:
 *     tags:
 *       - Seats
 *     summary: Delete a specific seat by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seat to delete
 *     responses:
 *       204:
 *         description: Seat successfully deleted
 *       400:
 *         description: Validation error
 *       404:
 *         description: Seat not found
 *       500:
 *         description: Internal server error
 */

    app.delete("/seats/:id", async (req: Request, res: Response) => {
        const validationResult = seatIdValidation.validate(req.params);
    
        if (validationResult.error) {
            res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            return;
        }
        const seatUsecase = new SeatUsecase(AppDataSource);

        const seatId: SeatIdRequest = validationResult.value;
    
        try {
            await seatUsecase.deleteSeat(seatId.id);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @openapi
 * /rooms:
 *   post:
 *     tags:
 *       - Rooms
 *     summary: Create a new room
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomRequest'
 *     responses:
 *       201:
 *         description: Room successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Input validation error
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /rooms:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: List all rooms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of rooms to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: An array of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /rooms/{id}:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get a specific room by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the room to retrieve
 *     responses:
 *       200:
 *         description: Room details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /rooms/{id}:
 *   patch:
 *     tags:
 *       - Rooms
 *     summary: Update a specific room by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the room to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoomRequest'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /rooms/{id}:
 *   delete:
 *     tags:
 *       - Rooms
 *     summary: Delete a specific room by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the room to delete
 *     responses:
 *       204:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /rooms/{roomid}/planning:
 *   get:
 *     tags:
 *       - Rooms
 *     summary: Get the scheduling of a specific room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomid
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the room to get scheduling for
 *     responses:
 *       200:
 *         description: Scheduling details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seance'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */

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
 ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 


/**
 * @openapi
 * /seances:
 *   post:
 *     tags:
 *       - Seances
 *     summary: Create a new seance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SeanceRequest'
 *     responses:
 *       201:
 *         description: Seance successfully created
 *       400:
 *         description: Input validation error
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /seances:
 *   get:
 *     tags:
 *       - Seances
 *     summary: List all seances
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number of the seance list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of seances to return per page
 *     responses:
 *       200:
 *         description: An array of seances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Seance'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /seances/{id}:
 *   get:
 *     tags:
 *       - Seances
 *     summary: Get a specific seance by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seance to retrieve
 *     responses:
 *       200:
 *         description: Seance details
 *       404:
 *         description: Seance not found
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /seances/{id}:
 *   patch:
 *     tags:
 *       - Seances
 *     summary: Update a specific seance by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seance to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSeanceRequest'
 *     responses:
 *       200:
 *         description: Seance updated successfully
 *       404:
 *         description: Seance not found
 *       500:
 *         description: Internal server error
 */

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
/**
 * @openapi
 * /seances/{id}:
 *   delete:
 *     tags:
 *       - Seances
 *     summary: Delete a specific seance by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the seance to delete
 *     responses:
 *       200:
 *         description: Seance deleted successfully
 *       404:
 *         description: Seance not found
 *       500:
 *         description: Internal server error
 */

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