import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserTokens1741140502230 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            CREATE TABLE IF NOT EXISTS "User_Tokens"(
                id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
                token UUID NOT NULL DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT FK_User_Tokens_Users FOREIGN KEY (user_id) REFERENCES "Users"(id)
            ) 
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "User_Tokens"`);
    }

}
