import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateColumnsCreatedAndUpdatedOnAddressTable1748214769181 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Addresses"
            ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
        `);

        await queryRunner.query(`
            ALTER TABLE "Addresses"
            ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Addresses"
            DROP COLUMN IF EXISTS "created_at";
        `);

        await queryRunner.query(`
            ALTER TABLE "Addresses"
            DROP COLUMN IF EXISTS "updated_at";
        `);
    }

}
