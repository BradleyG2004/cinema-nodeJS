import { MigrationInterface, QueryRunner } from "typeorm";

export class EAddUser1712288994305 implements MigrationInterface {
    name = 'EAddUser1712288994305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`coordinator\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`roleId\` int NULL, UNIQUE INDEX \`IDX_c2be39cf0d218ce0793e0a9845\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`coordinatorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`coordinator\` ADD CONSTRAINT \`FK_f3d954c22638dbdd766b99052b3\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`token\` ADD CONSTRAINT \`FK_10f3e1cf124f8e2d436c8c08718\` FOREIGN KEY (\`coordinatorId\`) REFERENCES \`coordinator\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`token\` DROP FOREIGN KEY \`FK_10f3e1cf124f8e2d436c8c08718\``);
        await queryRunner.query(`ALTER TABLE \`coordinator\` DROP FOREIGN KEY \`FK_f3d954c22638dbdd766b99052b3\``);
        await queryRunner.query(`DROP TABLE \`token\``);
        await queryRunner.query(`DROP INDEX \`IDX_c2be39cf0d218ce0793e0a9845\` ON \`coordinator\``);
        await queryRunner.query(`DROP TABLE \`coordinator\``);
        await queryRunner.query(`DROP TABLE \`role\``);
    }

}
