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
exports.coordMiddleware = void 0;
const database_1 = require("../../database/database");
const token_1 = require("../../database/entities/token");
const jsonwebtoken_1 = require("jsonwebtoken");
const coordMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.status(401).json({ "error": "Unauthorized" });
    const token = authHeader.split(' ')[1];
    if (token === null)
        return res.status(401).json({ "error": "Unauthorized" });
    const tokenRepo = database_1.AppDataSource.getRepository(token_1.Token);
    const tokenFound = yield tokenRepo.findOne({ where: { token } });
    if (!tokenFound) {
        return res.status(403).json({ "error": "Access Forbidden" });
    }
    const secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "NoNotThiss";
    (0, jsonwebtoken_1.verify)(token, secret, (err, coordinator) => {
        if (err)
            return res.status(403).json({ "error": "Access Forbidden" });
        req.user = coordinator;
        next();
    });
});
exports.coordMiddleware = coordMiddleware;
