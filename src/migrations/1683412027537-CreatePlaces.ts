import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlaces1683412027537 implements MigrationInterface {
  name = 'CreatePlaces1683412027537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "place" ("id" SERIAL NOT NULL, "country" character varying NOT NULL, "location" character varying NOT NULL, "goal" TIMESTAMP NOT NULL, "flagUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "place"`);
  }
}
