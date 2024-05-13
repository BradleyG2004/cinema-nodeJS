"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionIdValidation = exports.transactionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.transactionValidation = joi_1.default.object({
    eaccount: joi_1.default.number().required(),
    amount: joi_1.default.number().required(),
    type: joi_1.default.string().valid('deposit', 'withdrawal').required(),
    autorization: joi_1.default.required()
});
exports.transactionIdValidation = joi_1.default.object({
    id: joi_1.default.number().required(),
});
