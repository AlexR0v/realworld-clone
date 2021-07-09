import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1625826601622 implements MigrationInterface {
    name = 'CreateUsers1625826601622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `bio` varchar(255) NOT NULL DEFAULT '', `image` varchar(255) NOT NULL DEFAULT '', `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `users`");
    }

}
