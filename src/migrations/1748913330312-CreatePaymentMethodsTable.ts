import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentMethodsTable1748913330312 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "PaymentMethods" (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                method VARCHAR NOT NULL,
                installments INTEGER,
                card_brand VARCHAR,
                purchase_id UUID NOT NULL,
                CONSTRAINT fk_purchase FOREIGN KEY (purchase_id) REFERENCES "Purchase"(id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "PaymentMethods";
        `);
    }

}
