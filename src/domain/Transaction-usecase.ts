import { DataSource, Repository } from "typeorm";
import { Transaction } from "../database/entities/Transaction";
import { Client } from "../database/entities/client";

export interface CreateTransactionParams {
    amount: number;
    type: 'deposit' | 'withdrawal' | 'ticket_purchase';
    clientId: number;
}

export class TransactionUsecase {
    private transactionRepo: Repository<Transaction>;
    private clientRepo: Repository<Client>;

    constructor(private readonly db: DataSource) {
        this.transactionRepo = db.getRepository(Transaction);
        this.clientRepo = db.getRepository(Client);
    }

    async getTransactionsByClient(clientId: number): Promise<Transaction[]> {
        try {
            const client = await this.clientRepo.findOne({ where: { id: clientId } });
            if (!client) {
                throw new Error(`Client with ID ${clientId} not found.`);
            }

            const transactions = await this.transactionRepo.find({
                where: { clientId }
            });

            return transactions;
        } catch (error) {
            console.error("Error fetching transactions by client:", error);
            return [];
        }
    }

    async getTransactionById(id: number): Promise<Transaction | null> {
        try {
            const transaction = await this.transactionRepo.findOne({ where: { id } });
            return transaction || null;
        } catch (error) {
            console.error("Error fetching transaction by ID:", error);
            return null;
        }
    }

    async getAllTransactions(): Promise<Transaction[]> {
        try {
            const transactions = await this.transactionRepo.find();
            return transactions;
        } catch (error) {
            console.error("Error fetching all transactions:", error);
            return [];
        }
    }

    async createTransaction(params: CreateTransactionParams): Promise<Transaction | null> {
        const { amount, type, clientId } = params;

        try {
            const client = await this.clientRepo.findOne({ where: { id: clientId } });
            if (!client) {
                throw new Error(`Client with ID ${clientId} not found. Cannot create transaction.`);
            }

            const newTransaction = this.transactionRepo.create({
                amount,
                type,
                clientId
            });

            const savedTransaction = await this.transactionRepo.save(newTransaction);
            return savedTransaction;
        } catch (error) {
            console.error("Error creating transaction:", error);
            return null;
        }
    }

    async updateTransaction(id: number, amount: number): Promise<Transaction | null> {
        try {
            const transaction = await this.transactionRepo.findOne({ where: { id } });
            if (!transaction) {
                throw new Error(`Transaction with ID ${id} not found. Cannot update.`);
            }

            transaction.amount = amount;
            const updatedTransaction = await this.transactionRepo.save(transaction);
            return updatedTransaction;
        } catch (error) {
            console.error("Error updating transaction:", error);
            return null;
        }
    }
}
