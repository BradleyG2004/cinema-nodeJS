import { DataSource, Repository } from "typeorm";
import { Transaction } from "../database/entities/Transaction";
import { Client } from "../database/entities/client";
import { type } from "os";
import { Token } from "../database/entities/token";
import { Eaccount } from "../database/entities/eaccount";

export interface CreateTransactionParams {
    eaccount:number,
    amount: number;
    type: 'deposit' | 'withdrawal' | 'ticket_purchase';
    autorization: string;
}

export class TransactionUsecase {
    private transactionRepo: Repository<Transaction>;
    private clientRepo: Repository<Client>;

    constructor(private readonly db: DataSource) {
        this.transactionRepo = db.getRepository(Transaction);
        this.clientRepo = db.getRepository(Client);
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

    async createTransaction(params: CreateTransactionParams): Promise<Transaction | null | string> {
        try {
            const tokenRepo = this.db.getRepository(Token);
            const token = await tokenRepo.findOne({
                where: { token: params.autorization },
                relations: ['client']
            });
            if (!token) return "no token";
    
            const client = token.client;
    
            const eaccountRepo = this.db.getRepository(Eaccount);
            const eaccount = await eaccountRepo.findOne({where: {id: params.eaccount}, relations: ['transactions']});
            if (!eaccount) return "no eaccount";
    
            // Gestion de l'achat de billets
            if (params.type === "ticket_purchase") {
                const ticketPrice = 10; // Prix fixe pour un billet
                if (client.balance >= ticketPrice) {
                    client.balance -= ticketPrice;  
    
                    const transRepo = this.db.getRepository(Transaction);
                    const transaction = new Transaction();
                    transaction.amount = ticketPrice;
                    transaction.type = "ticket_purchase";
                    transaction.client = client;
                    transaction.eaccount = eaccount;  
                    await transRepo.save(transaction);
    
                    const clientRepo = this.db.getRepository(Client);
                    await clientRepo.save(client);  
    
                    return transaction;
                } else {
                    return "Solde insuffisant pour l'achat du billet";
                }
            }
    
            // Gestion des dépôts
            if (params.type == "deposit") {
                if (eaccount.balance >= params.amount) {
                    client.balance += params.amount;
                    eaccount.balance -= params.amount;
                    await eaccountRepo.save(eaccount);
    
                    const clientRepo = this.db.getRepository(Client);
                    const updatedClient = await clientRepo.save(client);
    
                    const transRepo = this.db.getRepository(Transaction);
                    const transaction = new Transaction();
                    transaction.amount = params.amount;
                    transaction.client = updatedClient;
                    transaction.eaccount = eaccount;
                    transaction.type = params.type;
                    await transRepo.save(transaction);
                    
                    return transaction;
                } else {
                    return "Opération impossible, fonds insuffisants dans le eaccount";
                }
            }
    
            // Gestion des retraits
            if (params.type == "withdrawal") {
                if (client.balance >= params.amount) {
                    client.balance -= params.amount;
                    eaccount.balance += params.amount;
                    await eaccountRepo.save(eaccount);
                    
                    const clientRepo = this.db.getRepository(Client);
                    const updatedClient = await clientRepo.save(client);
    
                    const transRepo = this.db.getRepository(Transaction);
                    const transaction = new Transaction();
                    transaction.amount = params.amount;
                    transaction.client = updatedClient;
                    transaction.eaccount = eaccount;
                    transaction.type = params.type;
                    await transRepo.save(transaction);
                    
                    return transaction;
                } else {
                    return "Opération impossible, solde insuffisant";
                }
            }
    
            return "Type d'opération non reconnu: " + params.type;
        } catch (error) {
            console.error("Erreur lors de la création de la transaction :", error);
            return null;
        }
    }
    async getCurrentBalance(clientId: number): Promise<number | string> {
        const clientRepo = this.db.getRepository(Client);
        const client = await clientRepo.findOne({ where: { id: clientId } });
        if (!client) return "Client introuvable";
    
        return client.balance;
    }
    
     async getTransactionHistory(clientId: number): Promise<Transaction[] | string> {
        const transRepo = this.db.getRepository(Transaction);
        const transactions = await transRepo.find({
            where: { client: { id: clientId } },
            relations: ['client']
        });
        return transactions;
    }


    // async updateTransaction(id: number, amount: number): Promise<Transaction | null> {
    //     try {
    //         const transaction = await this.transactionRepo.findOne({ where: { id } });
    //         if (!transaction) {
    //             throw new Error(`Transaction with ID ${id} not found. Cannot update.`);
    //         }

    //         transaction.amount = amount;
    //         const updatedTransaction = await this.transactionRepo.save(transaction);
    //         return updatedTransaction;
    //     } catch (error) {
    //         console.error("Error updating transaction:", error);
    //         return null;
    //     }
    // }
}
