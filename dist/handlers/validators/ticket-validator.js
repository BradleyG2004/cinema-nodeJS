"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketValidation = exports.ticketIdValidation = exports.listTicketValidation = exports.ticketValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ticketValidation = joi_1.default.object({
    autorization: joi_1.default.string().required(),
    seanceId: joi_1.default.number().required(),
    seatId: joi_1.default.number().required(),
    type: joi_1.default.string().valid('NORMAL', 'SUPER').required()
}).options({ abortEarly: false });
exports.listTicketValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional()
});
exports.ticketIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateTicketValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    seatNumber: joi_1.default.number().optional(),
    isValid: joi_1.default.boolean().optional(),
    type: joi_1.default.string().valid('NORMAL', 'SUPER').required()
});
