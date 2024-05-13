"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomValidation = exports.roomIdValidation = exports.listRoomValidation = exports.roomValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.roomValidation = joi_1.default.object({
    name: joi_1.default.string()
        .min(3)
        .required(),
    description: joi_1.default.string()
        .min(3)
        .optional(),
    type: joi_1.default.string()
        .min(3)
        .optional(),
    state: joi_1.default.boolean()
        .required(),
    capacity: joi_1.default.number()
        .min(15)
        .max(30)
        .required(),
    accessibility: joi_1.default.boolean()
        .required(),
}).options({ abortEarly: false });
exports.listRoomValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional()
});
exports.roomIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateRoomValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    type: joi_1.default.string(),
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    capacity: joi_1.default.number(),
    state: joi_1.default.boolean(),
    accessibility: joi_1.default.boolean(),
    authorization: joi_1.default.string().required()
});
