import { MigrationInterface, QueryRunner } from "typeorm";

export class MerchantsTable1756175163153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "Merchants" (
                id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                legal_name      varchar(150) NOT NULL,
                trade_name      varchar(150) NOT NULL,
                cnpj            varchar(14) NOT NULL UNIQUE,
                contact_email   varchar(150),
                phone           varchar(20),
                is_active       boolean NOT NULL DEFAULT true,
                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CHECK (cnpj ~ '^[0-9]{14}$')
            );

            ALTER TABLE "Products"
                ADD COLUMN IF NOT EXISTS merchant_id uuid;
            
            ALTER TABLE "Products"
                ADD CONSTRAINT products_merchant_id_fkey
                FOREIGN KEY (merchant_id) REFERENCES "Merchants"(id) ON DELETE CASCADE;

            CREATE INDEX IF NOT EXISTS idx_products_merchant ON "Products"(merchant_id);
            CREATE UNIQUE INDEX IF NOT EXISTS idx_products_merchant_name_unique
                ON "Products"(merchant_id, name)
                WHERE merchant_id IS NOT NULL;

        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_products_merchant_name_unique;
            DROP INDEX IF EXISTS idx_products_merchant;

            ALTER TABLE "Products" DROP CONSTRAINT IF EXISTS products_merchant_id_fkey;
            ALTER TABLE "Products" DROP COLUMN IF EXISTS merchant_id;
            
            DROP TABLE IF EXISTS "Merchants"
        `);
    } 

}
