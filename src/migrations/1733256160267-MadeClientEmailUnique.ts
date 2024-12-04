import { MigrationInterface, QueryRunner } from "typeorm";

export class MadeClientEmailUnique1733256160267 implements MigrationInterface {
    name = 'MadeClientEmailUnique1733256160267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12"`);
    }

}
