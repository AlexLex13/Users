import { MigrationInterface, QueryRunner } from "typeorm"

export class Init1702153798352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
      ` 
          --Table Definition
          CREATE TABLE IF NOT EXISTS "users"  (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "firstName" character varying NOT NULL,
            "lastName" character varying,
            "email" character varying UNIQUE NOT NULL,
            "password" character varying NOT NULL,
            "image"  character varying,
            "pdf" bytea,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
          )
          `
        )

        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS email_idx ON users (email)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS users`)
        await queryRunner.query(`DROP INDEX IF EXISTS email_idx`)
    }

}
