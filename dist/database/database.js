"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "51.159.113.109",
    port: 7052,
    username: "Thamila_Achat",
    password: "Thamilabkr4&",
    database: "cinema",
    logging: true,
    synchronize: false,
    entities: [
        "src/database/entities/*.ts"
    ],
    migrations: [
        "src/database/migrations/*.ts"
    ]
});
