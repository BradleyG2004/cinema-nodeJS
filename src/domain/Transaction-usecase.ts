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
            const eaccount = await eaccountRepo.findOne({where:{id:params.eaccount},relations: ['transactions'] });
            if (!eaccount) return "no eaccount";

            if(params.type=="deposit"){
                if(eaccount.balance>=params.amount){
                    client.balance+=params.amount
                    eaccount.balance-=params.amount
                    await eaccountRepo.save(eaccount);

                    const clientRepo = this.db.getRepository(Client);
                    const cliupdt = await clientRepo.findOne({where:{id:client.id}});
                    if (!cliupdt) return null;

                    cliupdt.balance=client.balance;
                    await clientRepo.save(cliupdt);

                    const transRepo = this.db.getRepository(Transaction);
                    const transactionn = new Transaction();
                    transactionn.amount=params.amount
                    transactionn.client=cliupdt
                    transactionn.eaccount=eaccount
                    transactionn.type=params.type
                    await transRepo.save(transactionn);
                    return  transactionn
                }else{
                   return  "Operation impossible"
                }

            }else if(params.type=="withdrawal"){
                if(client.balance>=params.amount){
                    client.balance-=params.amount
                    eaccount.balance+=params.amount
                    await eaccountRepo.save(eaccount);
                    
                    const clientRepo = this.db.getRepository(Client);
                    const cliupdt = await clientRepo.findOne({where:{id:client.id}});
                    if (!cliupdt) return null;
                    cliupdt.balance=client.balance;
                    await clientRepo.save(cliupdt);

                    const transRepo = this.db.getRepository(Transaction);
                    const transactionn = new Transaction();
                    transactionn.amount=params.amount
                    transactionn.client=cliupdt
                    transactionn.eaccount=eaccount
                    transactionn.type=params.type
                    await transRepo.save(transactionn);
                    return  transactionn
                }else{
                   return  "Operation impossible"
                }
            }
            return "Operation non reconnue "+params.type
        } catch (error) {
            console.error("Error creating transaction:", error);
            return null;
        }
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
