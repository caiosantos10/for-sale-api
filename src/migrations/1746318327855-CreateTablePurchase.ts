import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePurchase1746318327855 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "Purchase" (
                id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
                cart_id UUID NOT NULL,
                user_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_purchase_cart FOREIGN KEY (cart_id) REFERENCES "Carts"(id),
                CONSTRAINT fk_purchase_user FOREIGN KEY (user_id) REFERENCES "Users"(id)
            );    
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
