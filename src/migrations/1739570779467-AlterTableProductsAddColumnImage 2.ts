import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableProductsAddColumnImage1739570779467 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE IF EXISTS "Products"
            ADD COLUMN image VARCHAR(100) DEFAULT NULL NULL;
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE IF EXISTS "Products"
            DROP COLUMN IF EXISTS image   
        `);
    }
}
