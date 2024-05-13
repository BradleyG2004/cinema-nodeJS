"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoutes = void 0;
const generate_validation_message_1 = require("./validators/generate-validation-message");
const database_1 = require("../database/database");
const bcrypt_1 = require("bcrypt");
const client_1 = require("../database/entities/client");
const movie_1 = require("../database/entities/movie");
const client_validator_1 = require("./validators/client-validator");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../database/entities/token");
const coordinator_1 = require("../database/entities/coordinator");
const movie_validator_1 = require("./validators/movie-validator");
const movie_usecase_1 = require("../domain/movie-usecase");
const coord_middleware_1 = require("./middleware/coord-middleware");
const room_validator_1 = require("./validators/room-validator");
const room_1 = require("../database/entities/room");
const room_usecase_1 = require("../domain/room-usecase");
const coordinator_validator_1 = require("./validators/coordinator-validator");
const role_1 = require("../database/entities/role");
const sceance_validator_1 = require("./validators/sceance-validator");
const seance_usecase_1 = require("../domain/seance-usecase");
const comb_middleware_1 = require("./middleware/comb-middleware");
const ticket_validator_1 = require("./validators/ticket-validator");
const ticket_1 = require("../database/entities/ticket");
const seat_validator_1 = require("./validators/seat-validator");
const seat_usecase_1 = require("../domain/seat-usecase");
const seat_1 = require("../database/entities/seat");
const ticket_usecase_1 = require("../domain/ticket-usecase");
const Transaction_validator_1 = require("./validators/Transaction-validator");
const Transaction_usecase_1 = require("../domain/Transaction-usecase");
const seance_1 = require("../database/entities/seance");
const initRoutes = (app) => {
    /**
   * @openapi
   * /clients/signup:
   *   post:
   *     tags:
   *       - Clients
   *     summary: Register a new client
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       201:
   *         description: Client successfully registered
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 email:
   *                   type: string
   *                 createdAt:
   *                   type: string
   *                   format: date-time
   *       400:
   *         description: Validation error
   *       500:
   *         description: Internal server error
   */
    app.post('/clients/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // res.json({"req":req.body})
        try {
            const validationResult = client_validator_1.createClientValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const createClientRequest = validationResult.value;
            const hashedPassword = yield (0, bcrypt_1.hash)(createClientRequest.password, 10);
            const clientRepository = database_1.AppDataSource.getRepository(client_1.Client);
            const client = yield clientRepository.save({
                email: createClientRequest.email,
                password: hashedPassword
            });
            res.status(201).json({ id: client.id, email: client.email, createdAt: client.createdAt });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "error": "internal error retry later" });
            return;
        }
    }));
    /**
     * @openapi
     * /clients/login:
     *   post:
     *     tags:
     *       - Clients
     *     summary: Client login
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *     responses:
     *       200:
     *         description: Authentication successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid email or password
     *       500:
     *         description: Internal server error
     */
    app.post('/clients/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const validationResult = client_validator_1.LoginClientValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const loginClientRequest = validationResult.value;
            // valid client exist
            const client = yield database_1.AppDataSource.getRepository(client_1.Client).findOneBy({ email: loginClientRequest.email });
            if (!client) {
                res.status(400).json({ error: "email or password not valid" });
                return;
            }
            // valid password for this client
            const isValid = yield (0, bcrypt_1.compare)(loginClientRequest.password, client.password);
            if (!isValid) {
                res.status(400).json({ error: "email or password not valid" });
                return;
            }
            const secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "NoNotThis";
            //console.log(secret)
            // generate jwt
            const token = (0, jsonwebtoken_1.sign)({ clientId: client.id, email: client.email }, secret, { expiresIn: '1d' });
            // store un token pour un client
            yield database_1.AppDataSource.getRepository(token_1.Token).save({ token: token, client: client });
            res.status(200).json({ token, message: "authenticated ✅" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "error": "internal error retry later" });
            return;
        }
    }));
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
    * @openapi
    * /coordinators/signup:
    *   post:
    *     tags:
    *       - Coordinators
    *     summary: Register a new coordinator
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               email:
    *                 type: string
    *                 format: email
    *               password:
    *                 type: string
    *                 format: password
    *               role:
    *                 type: integer
    *                 description: ID of the role
    *     responses:
    *       201:
    *         description: Coordinator successfully registered
    *       400:
    *         description: Validation error or role not found
    *       500:
    *         description: Internal server error
    */
    app.post('/coordinators/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // res.json({"req":req.body})
        try {
            const validationResult = coordinator_validator_1.createCoordinatorValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const createCoordinatorRequest = validationResult.value;
            const RoleRepository = database_1.AppDataSource.getRepository(role_1.Role);
            const role = yield RoleRepository.findOneBy({ id: createCoordinatorRequest.role });
            if (role === null) {
                res.status(404).json({ "error": `role ${createCoordinatorRequest.role} not found` });
                return;
            }
            const hashedPassword = yield (0, bcrypt_1.hash)(createCoordinatorRequest.password, 10);
            const coordinatorRepository = database_1.AppDataSource.getRepository(coordinator_1.Coordinator);
            const coordinator = yield coordinatorRepository.save({
                email: createCoordinatorRequest.email,
                password: hashedPassword,
                role: role,
            });
            // res.json(typeof createCoordinatorRequest.role)
            res.status(201).json({ id: coordinator.id, email: coordinator.email, roleId: coordinator.role, createdAt: coordinator.createdAt });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "error": "internal error retry later" });
            return;
        }
    }));
    /**
     * @openapi
     * /coordinators/login:
     *   post:
     *     tags:
     *       - Coordinators
     *     summary: Coordinator login
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *     responses:
     *       200:
     *         description: Authentication successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                 message:
     *                   type: string
     *       400:
     *         description: Invalid email or password
     *       500:
     *         description: Internal server error
     */
    app.post('/coordinators/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const validationResult = client_validator_1.LoginClientValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const loginCoordinatorRequest = validationResult.value;
            // valid client exist
            const coordinator = yield database_1.AppDataSource.getRepository(coordinator_1.Coordinator).findOneBy({ email: loginCoordinatorRequest.email });
            if (!coordinator) {
                res.status(400).json({ error: "email or password not valid" });
                return;
            }
            // valid password for this client
            const isValid = yield (0, bcrypt_1.compare)(loginCoordinatorRequest.password, coordinator.password);
            if (!isValid) {
                res.status(400).json({ error: "email or password not valid" });
                return;
            }
            const secret = (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : "NoNotThiss";
            //console.log(secret)
            // generate jwt
            const token = (0, jsonwebtoken_1.sign)({ clientId: coordinator.id, email: coordinator.email }, secret, { expiresIn: '1d' });
            // store un token pour un client
            yield database_1.AppDataSource.getRepository(token_1.Token).save({ token: token, coordinator: coordinator });
            res.status(200).json({ token, message: "authenticated ✅" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "error": "internal error retry later" });
            return;
        }
    }));
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
    app.post("/movies", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = movie_validator_1.movieValidation.validate(req.body);
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const MovieRequest = validation.value;
        const MovieRepo = database_1.AppDataSource.getRepository(movie_1.Movie);
        try {
            const MovieCreated = yield MovieRepo.save(MovieRequest);
            res.status(201).json(MovieCreated);
        }
        catch (error) {
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.get("/movies", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const validation = movie_validator_1.listMovieValidation.validate(req.query);
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listMovieRequest = validation.value;
        let limit = 20;
        if (listMovieRequest.limit) {
            limit = listMovieRequest.limit;
        }
        const page = (_c = listMovieRequest.page) !== null && _c !== void 0 ? _c : 1;
        try {
            const movieUsecase = new movie_usecase_1.MovieUsecase(database_1.AppDataSource);
            const listmovies = yield movieUsecase.listMovie(Object.assign(Object.assign({}, listMovieRequest), { page, limit }));
            res.status(200).json(listmovies);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.get("/movies/:id", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = movie_validator_1.movieIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const movieId = validationResult.value;
            const movieRepository = database_1.AppDataSource.getRepository(movie_1.Movie);
            const movie = yield movieRepository.findOneBy({ id: movieId.id });
            if (movie === null) {
                res.status(404).json({ "error": `movie ${movieId.id} not found` });
                return;
            }
            res.status(200).json(movie);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.put("/movies/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = movie_validator_1.updateMovieValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        const movieUsecase = new movie_usecase_1.MovieUsecase(database_1.AppDataSource);
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateMovieRequest = validation.value;
        try {
            const movieUpdated = yield movieUsecase.updateMovie(updateMovieRequest.id, updateMovieRequest);
            if (!movieUpdated) {
                res.status(404).send({ error: `Movie ${updateMovieRequest.id} not found` });
                return;
            }
            res.status(200).send(movieUpdated);
        }
        catch (error) {
            if (error.message.includes("Les séances suivantes ne respectent pas")) {
                res.status(409).send({ error: error.message });
            }
            else {
                res.status(500).send({ error: "Internal error" });
            }
        }
    }));
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
    app.delete("/movies/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const movieId = parseInt(req.params.id);
        const movieRepository = database_1.AppDataSource.getRepository(movie_1.Movie);
        try {
            const movieToDelete = yield movieRepository.findOneBy({ id: movieId });
            if (!movieToDelete) {
                return res.status(404).send({ error: `Movie with ID ${movieId} not found` });
            }
            yield movieRepository.remove(movieToDelete);
            res.status(204).send(); // No Content
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal server error" });
        }
    }));
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
    app.post("/tickets", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        const validation = ticket_validator_1.ticketValidation.validate(Object.assign(Object.assign(Object.assign({}, req.params), req.body), { autorization: (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(" ")[1] }));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const ticketRequest = validation.value;
        try {
            const ticketUsecase = new ticket_usecase_1.TicketUsecase(database_1.AppDataSource);
            const ticketCreated = yield ticketUsecase.createTicket(ticketRequest);
            if (!ticketCreated) {
                res.status(404).send("Client or Seance not found");
            }
            res.status(404).send(ticketCreated);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.get("/tickets", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const validation = ticket_validator_1.listTicketValidation.validate(req.query);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listTicketRequest = validation.value;
        let limit = 20; // Default limit
        if (listTicketRequest.limit) {
            limit = listTicketRequest.limit;
        }
        const page = (_e = listTicketRequest.page) !== null && _e !== void 0 ? _e : 1;
        try {
            const ticketUsecase = new ticket_usecase_1.TicketUsecase(database_1.AppDataSource);
            const tickets = yield ticketUsecase.listTickets({ page, limit });
            res.status(200).send(tickets);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.get("/tickets/:id", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = ticket_validator_1.ticketIdValidation.validate(req.params);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const ticketId = validationResult.value.id;
        const ticketRepo = database_1.AppDataSource.getRepository(ticket_1.Ticket);
        try {
            const ticket = yield ticketRepo.findOneBy({ id: ticketId });
            if (!ticket) {
                res.status(404).send({ error: `Ticket ${ticketId} not found` });
                return;
            }
            res.status(200).send(ticket);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.put("/tickets/:id", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = ticket_validator_1.updateTicketValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateTicketRequest = validation.value;
        const ticketRepo = database_1.AppDataSource.getRepository(ticket_1.Ticket);
        try {
            const ticket = yield ticketRepo.findOneBy({ id: updateTicketRequest.id });
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
            if (updateTicketRequest.type !== undefined) {
                ticket.type = updateTicketRequest.type;
            }
            const updatedTicket = yield ticketRepo.save(ticket);
            res.status(200).send(updatedTicket);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.delete("/tickets/:id", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = ticket_validator_1.ticketIdValidation.validate(req.params);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const ticketUsecase = new ticket_usecase_1.TicketUsecase(database_1.AppDataSource);
        const ticketId = validationResult.value;
        try {
            res.status(200).send(yield ticketUsecase.deleteTicket(ticketId.id));
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.post("/seats", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = seat_validator_1.seatValidation.validate(req.body);
        const seatUsecase = new seat_usecase_1.SeatUsecase(database_1.AppDataSource);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const seatRequest = validation.value;
        try {
            const seatCreated = yield seatUsecase.createSeat(seatRequest);
            res.status(201).send(seatCreated);
        }
        catch (error) {
            if (error.message.includes("has reached its maximum capacity")) {
                res.status(409).send({ error: error.message });
            }
            else {
                res.status(500).send({ error: "Internal error" });
            }
        }
    }));
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
    app.get("/seats", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        const validation = seat_validator_1.listSeatValidation.validate(req.query);
        const seatUsecase = new seat_usecase_1.SeatUsecase(database_1.AppDataSource);
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listSeatRequest = validation.value;
        let limit = 20; // Default limit
        if (listSeatRequest.limit) {
            limit = listSeatRequest.limit;
        }
        const page = (_f = listSeatRequest.page) !== null && _f !== void 0 ? _f : 1;
        try {
            const seats = yield seatUsecase.listSeats({ page, limit });
            res.status(200).send(seats);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.get("/seats/:id", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = seat_validator_1.seatIdValidation.validate(req.params);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const seatId = validationResult.value;
        const seatRepo = database_1.AppDataSource.getRepository(seat_1.Seat);
        try {
            const seat = yield seatRepo.findOneBy({ id: seatId.id });
            if (!seat) {
                res.status(404).send({ error: `Seat ${seatId.id} not found` });
                return;
            }
            res.status(200).send(seat);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.put("/seats/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = seat_validator_1.updateSeatValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validation.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateSeatRequest = validation.value;
        const seatUsecase = new seat_usecase_1.SeatUsecase(database_1.AppDataSource);
        try {
            const seatUpdated = yield seatUsecase.updateSeat(updateSeatRequest.id, updateSeatRequest);
            if (!seatUpdated) {
                res.status(404).send({ error: `Seat ${updateSeatRequest.id} not found` });
                return;
            }
            res.status(200).send(seatUpdated);
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.delete("/seats/:id", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validationResult = seat_validator_1.seatIdValidation.validate(req.params);
        if (validationResult.error) {
            res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const seatUsecase = new seat_usecase_1.SeatUsecase(database_1.AppDataSource);
        const seatId = validationResult.value;
        try {
            res.status(200).send(yield seatUsecase.deleteSeat(seatId.id));
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal error" });
        }
    }));
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
    app.post("/rooms", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = room_validator_1.roomValidation.validate(req.body);
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const RoomRequest = validation.value;
        const RoomRepo = database_1.AppDataSource.getRepository(room_1.Room);
        try {
            const RoomCreated = yield RoomRepo.save(RoomRequest);
            res.status(201).json(RoomCreated);
        }
        catch (error) {
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.get("/rooms", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _g;
        const validation = room_validator_1.listRoomValidation.validate(req.query);
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listRoomRequest = validation.value;
        let limit = 20;
        if (listRoomRequest.limit) {
            limit = listRoomRequest.limit;
        }
        const page = (_g = listRoomRequest.page) !== null && _g !== void 0 ? _g : 1;
        try {
            const roomUsecase = new room_usecase_1.RoomUsecase(database_1.AppDataSource);
            const listrooms = yield roomUsecase.listRoom(Object.assign(Object.assign({}, listRoomRequest), { page, limit }));
            res.status(200).json(listrooms);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.get("/rooms/:id", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = room_validator_1.roomIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const roomId = validationResult.value;
            const roomRepository = database_1.AppDataSource.getRepository(room_1.Room);
            const room = yield roomRepository.findOneBy({ id: roomId.id });
            if (room === null) {
                res.status(404).json({ "error": `room ${roomId.id} not found` });
                return;
            }
            res.status(200).json(room);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.patch("/rooms/:id", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _h;
        const validation = room_validator_1.updateRoomValidation.validate(Object.assign(Object.assign(Object.assign({}, req.params), req.body), { authorization: (_h = req.headers.authorization) === null || _h === void 0 ? void 0 : _h.split(" ")[1] }));
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateRoomRequest = validation.value;
        try {
            const roomUsecase = new room_usecase_1.RoomUsecase(database_1.AppDataSource);
            const updatedRoom = yield roomUsecase.updateRoom(updateRoomRequest.id, updateRoomRequest.authorization, Object.assign({}, updateRoomRequest));
            if (updatedRoom === null) {
                res.status(404).json({ "error": `room ${updateRoomRequest.id} not found` });
                return;
            }
            res.status(200).json(updatedRoom);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.delete("/rooms/:id", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = room_validator_1.roomIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const roomId = validationResult.value;
            const roomRepository = database_1.AppDataSource.getRepository(room_1.Room);
            const room = yield roomRepository.findOneBy({ id: roomId.id });
            if (room === null) {
                res.status(404).json({ "error": `room ${roomId.id} not found` });
                return;
            }
            const roomDeleted = yield roomRepository.remove(room);
            res.status(200).json(roomDeleted);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.get("/rooms/:roomid/planning", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _j;
        const validationResult = sceance_validator_1.seanceRoomValidation.validate(Object.assign(Object.assign({}, req.params), req.body));
        if (validationResult.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
            return;
        }
        const rech = validationResult.value;
        let limit = 20;
        if (rech.limit) {
            limit = rech.limit;
        }
        const page = (_j = rech.page) !== null && _j !== void 0 ? _j : 1;
        try {
            const seanceUsecase = new seance_usecase_1.SeanceUsecase(database_1.AppDataSource);
            const listseances = yield seanceUsecase.listseance(Object.assign(Object.assign({}, rech), { page, limit }));
            res.status(200).json(listseances);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.post("/seances", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _k;
        const validation = sceance_validator_1.seanceValidation.validate(Object.assign(Object.assign(Object.assign({}, req.params), req.body), { autorization: (_k = req.headers.authorization) === null || _k === void 0 ? void 0 : _k.split(" ")[1] }));
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const seanceRequest = validation.value;
        try {
            const seanceUsecase = new seance_usecase_1.SeanceUsecase(database_1.AppDataSource);
            const seanceCreated = yield seanceUsecase.createSeance(seanceRequest.starting, seanceRequest.room, seanceRequest.movie, seanceRequest.autorization);
            res.status(201).json(seanceCreated);
        }
        catch (error) {
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.get("/seances", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _l;
        const validation = sceance_validator_1.listSeanceValidation.validate(req.query);
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const listSeanceRequest = validation.value;
        let limit = 20;
        if (listSeanceRequest.limit) {
            limit = listSeanceRequest.limit;
        }
        const page = (_l = listSeanceRequest.page) !== null && _l !== void 0 ? _l : 1;
        try {
            const seanceUsecase = new seance_usecase_1.SeanceUsecase(database_1.AppDataSource);
            const listrooms = yield seanceUsecase.listSeance(Object.assign(Object.assign({}, listSeanceRequest), { page, limit }));
            res.status(200).json(listrooms);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.get("/seances/:id", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = sceance_validator_1.seanceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const seanceId = validationResult.value;
            const seanceRepository = database_1.AppDataSource.getRepository(seance_1.Seance);
            const seance = yield seanceRepository.findOneBy({ id: seanceId.id });
            if (seance === null) {
                res.status(404).json({ "error": `seance ${seanceId.id} not found` });
                return;
            }
            res.status(200).json(seance);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.patch("/seances/:id", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _m;
        const validation = sceance_validator_1.updateSeanceValidation.validate(Object.assign(Object.assign(Object.assign({}, req.params), req.body), { authorization: (_m = req.headers.authorization) === null || _m === void 0 ? void 0 : _m.split(" ")[1] }));
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        const updateSeanceRequest = validation.value;
        try {
            const seanceUsecase = new seance_usecase_1.SeanceUsecase(database_1.AppDataSource);
            const updatedSeance = yield seanceUsecase.updateSeance(updateSeanceRequest.id, updateSeanceRequest.authorization, Object.assign({}, updateSeanceRequest));
            if (updatedSeance === null) {
                res.status(404).json({ "error": `seance ${updateSeanceRequest.id} not found` });
                return;
            }
            res.status(200).json(updatedSeance);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
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
    app.delete("/seances/:id", coord_middleware_1.coordMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationResult = sceance_validator_1.seanceIdValidation.validate(req.params);
            if (validationResult.error) {
                res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const seanceId = validationResult.value;
            const seanceRepository = database_1.AppDataSource.getRepository(seance_1.Seance);
            const seance = yield seanceRepository.findOneBy({ id: seanceId.id });
            if (seance === null) {
                res.status(404).json({ "error": `seance ${seanceId.id} not found` });
                return;
            }
            const seanceDeleted = yield seanceRepository.remove(seance);
            res.status(200).json(seanceDeleted);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
    /**
     * @openapi
     * /seances/{seanceId}/tickets/{ticketId}/use:
     *   post:
     *     tags:
     *       - Tickets
     *     summary: Use a ticket for a specific seance
     *     description: Validates and records the usage of a ticket for a specified seance, specially handling Super Tickets which can be used multiple times.
     *     parameters:
     *       - in: path
     *         name: seanceId
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the seance for which the ticket is being used.
     *       - in: path
     *         name: ticketId
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the ticket being used.
     *     responses:
     *       200:
     *         description: The ticket has been successfully used for the seance.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: 'Ticket is valid for this seance.'
     *       400:
     *         description: There was an error in using the ticket for the seance, such as the ticket being fully used or does not exist.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: 'Super Ticket has already been used 10 times or ticket does not match this seance.'
     *       500:
     *         description: Internal server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: 'Internal error'
     */
    app.post("/seances/:seanceId/tickets/:ticketId/use", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { seanceId, ticketId } = req.params;
        const ticketUseCase = new ticket_usecase_1.TicketUsecase(database_1.AppDataSource);
        const result = yield ticketUseCase.useTicketForSeance(parseInt(ticketId), parseInt(seanceId));
        if (result.status === 'error') {
            return res.status(400).send({ error: result.message });
        }
        res.status(200).send({ message: result.message });
    }));
    /**
     * @openapi
     * /transactions:
     *   post:
     *     tags:
     *       - Transactions
     *     summary: Create a new transaction
     *     description: Registers a new financial transaction in the system based on the provided data.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TransactionRequest'
     *     responses:
     *       201:
     *         description: Transaction successfully created.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Transaction'
     *       400:
     *         description: Validation error on request.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Internal server error.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    app.post("/transactions", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _o;
        const validation = Transaction_validator_1.transactionValidation.validate(Object.assign(Object.assign(Object.assign({}, req.params), req.body), { autorization: (_o = req.headers.authorization) === null || _o === void 0 ? void 0 : _o.split(" ")[1] }));
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        try {
            // const { amount, type, clientId } = req.body;
            const TransacRequest = validation.value;
            const transactionUsecase = new Transaction_usecase_1.TransactionUsecase(database_1.AppDataSource);
            const createdTransaction = yield transactionUsecase.createTransaction(TransacRequest);
            res.status(201).json(createdTransaction);
        }
        catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }));
    /**
     * @openapi
     * /transactions/{id}:
     *   get:
     *     tags:
     *       - Transactions
     *     summary: Retrieve a transaction by ID
     *     description: Fetches a detailed view of a specific transaction by its unique ID.
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The unique identifier of the transaction to retrieve.
     *     responses:
     *       200:
     *         description: Transaction details retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Transaction'
     *       404:
     *         description: Transaction not found.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       500:
     *         description: Internal server error.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    //récupérer le détail d'une transaction
    app.get("/transactions/:id", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const transactionId = parseInt(id, 10);
            const transactionUsecase = new Transaction_usecase_1.TransactionUsecase(database_1.AppDataSource);
            const transaction = yield transactionUsecase.getTransactionById(transactionId);
            if (transaction) {
                res.status(200).json(transaction);
            }
            else {
                res.status(404).json({ error: `Transaction with ID ${transactionId} not found` });
            }
        }
        catch (error) {
            console.error("Error fetching transaction:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }));
    /**
     * @openapi
     * /transactions:
     *   get:
     *     tags:
     *       - Transactions
     *     summary: List all transactions
     *     description: Returns a list of all transactions in the system.
     *     responses:
     *       200:
     *         description: List of transactions retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Transaction'
     *       500:
     *         description: Internal server error.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    app.get("/transactions", comb_middleware_1.combMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const validation = sceance_validator_1.listSeanceValidation.validate(req.query);
        if (validation.error) {
            res.status(400).json((0, generate_validation_message_1.generateValidationErrorMessage)(validation.error.details));
            return;
        }
        try {
            const ListUsecase = new Transaction_usecase_1.TransactionUsecase(database_1.AppDataSource);
            const listrooms = yield ListUsecase.getAllTransactions();
            res.status(200).json(listrooms);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal error" });
        }
    }));
    /*app.get("/api/statistiques", async (req: Request, res: Response) => {
        try {
            // Utiliser un cas d'utilisation ou un service pour récupérer les statistiques
            const seanceUsecase = new SeanceUsecase(AppDataSource);
            const frequentationStatistiques = await seanceUsecase.getFrequentationStatistics();

            res.status(200).json(frequentationStatistiques);
        } catch (error) {
            console.error("Error fetching attendance statistics:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });*/
    app.get("/statistiques", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const seanceUsecase = new seance_usecase_1.SeanceUsecase(database_1.AppDataSource);
            const frequentationStats = yield seanceUsecase.getFrequentationStatistics();
            res.status(200).json(frequentationStats);
        }
        catch (error) {
            console.error("Error fetching attendance statistics:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }));
};
exports.initRoutes = initRoutes;
