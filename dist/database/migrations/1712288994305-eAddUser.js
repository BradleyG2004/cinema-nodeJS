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
exports.EAddUser1712288994305 = void 0;
class EAddUser1712288994305 {
    constructor() {
        this.name = 'EAddUser1712288994305';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`coordinator\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`roleId\` int NULL, UNIQUE INDEX \`IDX_c2be39cf0d218ce0793e0a9845\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`coordinatorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
            yield queryRunner.query(`ALTER TABLE \`coordinator\` ADD CONSTRAINT \`FK_f3d954c22638dbdd766b99052b3\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_10f3e1cf124f8e2d436c8c08718\` FOREIGN KEY (\`coordinatorId\`) REFERENCES \`coordinator\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_10f3e1cf124f8e2d436c8c08718\``);
            yield queryRunner.query(`ALTER TABLE \`coordinator\` DROP FOREIGN KEY \`FK_f3d954c22638dbdd766b99052b3\``);
            yield queryRunner.query(`DROP TABLE \`token\``);
            yield queryRunner.query(`DROP INDEX \`IDX_c2be39cf0d218ce0793e0a9845\` ON \`coordinator\``);
            yield queryRunner.query(`DROP TABLE \`coordinator\``);
            yield queryRunner.query(`DROP TABLE \`role\``);
        });
    }
}
exports.EAddUser1712288994305 = EAddUser1712288994305;
