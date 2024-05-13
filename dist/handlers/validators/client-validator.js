"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginClientValidation = exports.createClientValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createClientValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
}).options({ abortEarly: false });
exports.LoginClientValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
}).options({ abortEarly: false });
