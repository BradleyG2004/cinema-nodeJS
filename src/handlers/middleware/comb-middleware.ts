import { NextFunction, Response, Request } from "express";
import { AppDataSource } from "../../database/database";
import { Token } from "../../database/entities/token";
import { verify } from "jsonwebtoken";

export const combMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({"error": "Unauthorized"});

    const token = authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({"error": "Unauthorized"});

    const tokenRepo = AppDataSource.getRepository(Token)
    const tokenFound = await tokenRepo.findOne({ where: { token } })
    if (!tokenFound) {
        return res.status(403).json({"error": "Access Forbidden"})
    }

    const secret = process.env.JWT_SECRET ?? "NoNotThiss"

    // Middleware for coordinator
    verify(token, secret, (err, coordinator) => {
        if (!err) {
            (req as any).user = coordinator;
            return next(); // Pass to the next middleware or route
        }
        cliMiddleware(req, res, next);
    });
};

const cliMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({"error": "Unauthorized"});

    const token = authHeader.split(' ')[1];
    if (token === null) return res.status(401).json({"error": "Unauthorized"});

    const tokenRepo = AppDataSource.getRepository(Token)
    const tokenFound = await tokenRepo.findOne({ where: { token } })
    if (!tokenFound) {
        return res.status(403).json({"error": "Access Forbidden"})
    }

    const secret = process.env.JWT_SECRET ?? "NoNotThis"

    // Middleware for coordinator
    verify(token, secret, (err, coordinator) => {
        if (!err) {
            (req as any).user = coordinator;
            return next(); // Pass to the next middleware or route
        }
        // Both middlewares failed, return Access Forbidden
        return res.status(403).json({"error": "Access Forbidden"});
    });
};