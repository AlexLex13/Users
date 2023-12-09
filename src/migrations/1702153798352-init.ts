import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1702153798352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
      ` 
          --Table Definition
          CREATE TABLE "users"  (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "firstName" character varying NOT NULL,
            "lastName" character varying,
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "image"  character varying,
            "pdf" bytea,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
          )
          `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
