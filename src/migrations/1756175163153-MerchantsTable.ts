import { MigrationInterface, QueryRunner } from "typeorm";

export class MerchantsTable1756175163153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "Merchants" (
                id              uuid PRIMARY KEY DEFAULT uuid_generate_v4()
                legal_name      varchar(150) NOT NULL,
                trade_name      varchar(150) NOT NULL,
                cnpj            varchar(14) NOT NULL UNIQUE,
                contact_email   varchar(150),
                phone           varchar(20),
                is_active       boolean NOT NULL DEFAULT true,
                created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "Merchants"`);
    } 

}
