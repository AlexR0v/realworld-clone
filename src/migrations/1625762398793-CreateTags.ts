import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTags1625762398793 implements MigrationInterface {
    name = 'CreateTags1625762398793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `tags` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `tags`");
    }

}
