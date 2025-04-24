import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCart1745012494060 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "Carts"(
                id UUID PRIMARY KEY NOT NULL,
                user_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES "Users"(id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "Carts"`);
    }

}
