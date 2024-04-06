import express, { Request, Response } from "express";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";
import { ClientHandler } from "./client";
import { authMiddleware } from "./middleware/auth-middleware";
import { invalidPathHandler } from "./errors/invalid-path-handler";
import { hash } from "bcrypt";
import { Client } from "../database/entities/client";
import { createClientValidation } from "./validators/client-validator";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "hello world" })
    })

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
            res.send({"message":"Bloccckkkuuuusss"})
            // res.status(201).send({ id: client.id, email: client.email, createdAt: client.createdAt })
            // return
        } catch (error) { 
            console.log(error)
            res.status(500).send({ "error": "internal error retry later 🫡" })
            return
        }
    })
}