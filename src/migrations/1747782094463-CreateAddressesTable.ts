import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAddressesTable1747782094463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "Addresses" (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                street VARCHAR NOT NULL,
                number VARCHAR NOT NULL,
                city VARCHAR NOT NULL,
                state VARCHAR NOT NULL,
                zip_code VARCHAR NOT NULL,
                user_id UUID NOT NULL,
                CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "Users"(id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "Addresses";
        `);
    }

}
