import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateColumnDeliveryAddress1747875284044 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableHasColumn = await queryRunner.hasColumn("Purchase", "delivery_address");
        if (!tableHasColumn) {
            await queryRunner.query(`
                ALTER TABLE "Purchase"
                ADD COLUMN "delivery_address" TEXT
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableHasColumn = await queryRunner.hasColumn("Purchase", "delivery_address");
        if (tableHasColumn) {
            await queryRunner.query(`
                ALTER TABLE "Purchase"
                DROP COLUMN IF EXISTS "delivery_address"
            `);
        }
    }
}
