import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePurchase1746318327855 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'purchase_status') THEN
                    CREATE TYPE "purchase_status" AS ENUM (
                        'CREATED',
                        'GETTING_READY',
                        'OUT_FOR_DELIVERY',
                        'DELIVERED',
                        'CANCELLED'
                    );
                END IF;
            END
            $$;

            CREATE TABLE IF NOT EXISTS "Purchase" (
                id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
                status purchase_status NOT NULL DEFAULT 'CREATED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_purchase_user FOREIGN KEY (user_id) REFERENCES "Users"(id)
            );

            CREATE TABLE IF NOT EXISTS "PurchaseProducts" (
                id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
                purchase_id UUID NOT NULL,
                product_id UUID NOT NULL,
                quantity INTEGER NOT NULL,
                observations TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_purchaseProducts_purchase FOREIGN KEY (purchase_id) REFERENCES "Purchase"(id) ON DELETE CASCADE,
                CONSTRAINT fk_purchaseProducts_product FOREIGN KEY (product_id) REFERENCES "Products"(id)
            );
        `);
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "PurchaseProducts"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "Purchase"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "purchase_status"`);
    }

}
