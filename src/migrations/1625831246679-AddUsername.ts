import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsername1625831246679 implements MigrationInterface {
    name = 'AddUsername1625831246679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `username` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `username`");
    }

}
