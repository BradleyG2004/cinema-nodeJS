import { DataSource } from "typeorm";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "51.159.113.109",  
    port: 7052,
    username: "Thamila_Achat",
    password: "Thamilabkr4&",
    database: "Cinema;",
    logging: true,
    synchronize: false,
    entities: [
        "src/database/entities/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ]
})
