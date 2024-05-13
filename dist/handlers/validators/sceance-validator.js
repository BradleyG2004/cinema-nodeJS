"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeanceValidation = exports.seanceIdValidation = exports.listSeanceValidation = exports.seanceRoomValidation = exports.seanceValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.seanceValidation = joi_1.default.object({
    starting: joi_1.default.date()
        .iso()
        .required(),
    ending: joi_1.default.date()
        .iso()
        .optional(),
    room: joi_1.default.number().required(),
    movie: joi_1.default.number().required(),
    autorization: joi_1.default.required()
}).options({ abortEarly: false });
exports.seanceRoomValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
    from: joi_1.default.date()
        .iso()
        .required(),
    to: joi_1.default.date()
        .iso()
        .required(),
    roomid: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.listSeanceValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional()
});
exports.seanceIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateSeanceValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    starting: joi_1.default.date()
        .iso(),
    room: joi_1.default.number(),
    movie: joi_1.default.number(),
    authorization: joi_1.default.string().required()
});
