import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRelationsBetwennArticlesAndUser1626427893310 implements MigrationInterface {
    name = 'AddRelationsBetwennArticlesAndUser1626427893310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `articles` ADD `authorId` int NULL");
        await queryRunner.query("ALTER TABLE `articles` ADD CONSTRAINT `FK_65d9ccc1b02f4d904e90bd76a34` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `articles` DROP FOREIGN KEY `FK_65d9ccc1b02f4d904e90bd76a34`");
        await queryRunner.query("ALTER TABLE `articles` DROP COLUMN `authorId`");
    }

}
