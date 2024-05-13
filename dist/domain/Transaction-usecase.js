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
exports.TransactionUsecase = void 0;
const Transaction_1 = require("../database/entities/Transaction");
const client_1 = require("../database/entities/client");
const token_1 = require("../database/entities/token");
const eaccount_1 = require("../database/entities/eaccount");
class TransactionUsecase {
    constructor(db) {
        this.db = db;
        this.transactionRepo = db.getRepository(Transaction_1.Transaction);
        this.clientRepo = db.getRepository(client_1.Client);
    }
    // async getTransactionsByClient(clientId: number): Promise<Transaction[]> {
    //     try {
    //         const client = await this.clientRepo.findOne({ where: { id: clientId } });
    //         if (!client) {
    //             throw new Error(`Client with ID ${clientId} not found.`);
    //         }
    //         const transactions = await this.transactionRepo.find({
    //             where: { clientId }
    //         });
    //         return transactions;
    //     } catch (error) {
    //         console.error("Error fetching transactions by client:", error);
    //         return [];
    //     }
    // }
    getTransactionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.transactionRepo.findOne({ where: { id } });
                return transaction || null;
            }
            catch (error) {
                console.error("Error fetching transaction by ID:", error);
                return null;
            }
        });
    }
    getAllTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield this.transactionRepo.find();
                return transactions;
            }
            catch (error) {
                console.error("Error fetching all transactions:", error);
                return [];
            }
        });
    }
    createTransaction(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenRepo = this.db.getRepository(token_1.Token);
                const token = yield tokenRepo.findOne({
                    where: { token: params.autorization },
                    relations: ['client']
                });
                if (!token)
                    return "no token";
                const client = token.client;
                const eaccountRepo = this.db.getRepository(eaccount_1.Eaccount);
                const eaccount = yield eaccountRepo.findOne({ where: { id: params.eaccount }, relations: ['transactions'] });
                if (!eaccount)
                    return "no eaccount";
                if (params.type == "deposit") {
                    if (eaccount.balance >= params.amount) {
                        client.balance += params.amount;
                        eaccount.balance -= params.amount;
                        yield eaccountRepo.save(eaccount);
                        const clientRepo = this.db.getRepository(client_1.Client);
                        const cliupdt = yield clientRepo.findOne({ where: { id: client.id } });
                        if (!cliupdt)
                            return null;
                        cliupdt.balance = client.balance;
                        yield clientRepo.save(cliupdt);
                        const transRepo = this.db.getRepository(Transaction_1.Transaction);
                        const transactionn = new Transaction_1.Transaction();
                        transactionn.amount = params.amount;
                        transactionn.client = cliupdt;
                        transactionn.eaccount = eaccount;
                        transactionn.type = params.type;
                        yield transRepo.save(transactionn);
                        return transactionn;
                    }
                    else {
                        return "Operation impossible";
                    }
                }
                else if (params.type == "withdrawal") {
                    if (client.balance >= params.amount) {
                        client.balance -= params.amount;
                        eaccount.balance += params.amount;
                        yield eaccountRepo.save(eaccount);
                        const clientRepo = this.db.getRepository(client_1.Client);
                        const cliupdt = yield clientRepo.findOne({ where: { id: client.id } });
                        if (!cliupdt)
                            return null;
                        cliupdt.balance = client.balance;
                        yield clientRepo.save(cliupdt);
                        const transRepo = this.db.getRepository(Transaction_1.Transaction);
                        const transactionn = new Transaction_1.Transaction();
                        transactionn.amount = params.amount;
                        transactionn.client = cliupdt;
                        transactionn.eaccount = eaccount;
                        transactionn.type = params.type;
                        yield transRepo.save(transactionn);
                        return transactionn;
                    }
                    else {
                        return "Operation impossible";
                    }
                }
                return "Operation non reconnue " + params.type;
            }
            catch (error) {
                console.error("Error creating transaction:", error);
                return null;
            }
        });
    }
}
exports.TransactionUsecase = TransactionUsecase;
