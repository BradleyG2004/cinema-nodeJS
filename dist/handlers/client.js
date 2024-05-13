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
exports.ClientHandler = void 0;
const database_1 = require("../database/database");
const bcrypt_1 = require("bcrypt");
const client_validator_1 = require("./validators/client-validator");
const generate_validation_message_1 = require("./validators/generate-validation-message");
const client_1 = require("../database/entities/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const token_1 = require("../database/entities/token");
const ClientHandler = (app) => {
    app.post('/auth/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send({ "req": req.body });
        try {
            const validationResult = client_validator_1.createClientValidation.validate(req.body);
            if (validationResult.error) {
                res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
                return;
            }
            const createClientRequest = validationResult.value;
            const hashedPassword = yield (0, bcrypt_1.hash)(createClientRequest.password, 10);
            const clientRepository = database_1.AppDataSource.getRepository(client_1.Client);
            const client = yield clientRepository.save({
                email: createClientRequest.email,
                password: hashedPassword
            });
            res.status(201).send({ id: client.id, email: client.email, createdAt: client.createdAt });
            return;
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ "error": "internal error retry later" });
            return;
        }
    }));
    app.post('/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                res.status(400).send({ error: "email or password not valid" });
                return;
            }
            // valid password for this client
            const isValid = yield (0, bcrypt_1.compare)(loginClientRequest.password, client.password);
            if (!isValid) {
                res.status(400).send({ error: "email or password not valid" });
                return;
            }
            const secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "";
            console.log(secret);
            // generate jwt
            const token = (0, jsonwebtoken_1.sign)({ clientId: client.id, email: client.email }, secret, { expiresIn: '1d' });
            // store un token pour un client
            yield database_1.AppDataSource.getRepository(token_1.Token).save({ token: token, client: client });
            res.status(200).json({ token }).send({ "message": "authenticated ✅" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ "error": "internal error retry later" });
            return;
        }
    }));
};
exports.ClientHandler = ClientHandler;
