"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMovieValidation = exports.movieIdValidation = exports.listMovieValidation = exports.movieValidation = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateMovie:
 *       type: object
 *       required:
 *         - name
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom du film
 *         duration:
 *           type: number
 *           description: La duree en minutes
 *       example:
 *         name: Titanic
 *         price: 60
 */
exports.movieValidation = joi_1.default.object({
    name: joi_1.default.string()
        .min(3)
        .required(),
    duration: joi_1.default.number().required()
}).options({ abortEarly: false });
exports.listMovieValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional()
});
exports.movieIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.updateMovieValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
    name: joi_1.default.string().min(3).optional(),
    duration: joi_1.default.number().min(1).optional()
}).options({ abortEarly: false });
