"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeatValidation = exports.seatIdValidation = exports.listSeatValidation = exports.seatValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const seat_1 = require("../../database/entities/seat");
exports.seatValidation = joi_1.default.object({
    type: joi_1.default.string().valid(seat_1.SeatType.regular, seat_1.SeatType.premium, seat_1.SeatType.vip).required(),
    roomId: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.listSeatValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional()
});
exports.seatIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateSeatValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    type: joi_1.default.string().valid(seat_1.SeatType.regular, seat_1.SeatType.premium, seat_1.SeatType.vip).optional()
});
