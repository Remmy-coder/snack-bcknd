import { MigrationInterface, QueryRunner } from "typeorm";

export class ClientEntityCreated1733196233813 implements MigrationInterface {
    name = 'ClientEntityCreated1733196233813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rsaPin" character varying NOT NULL, "surname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "client"`);
    }

}
