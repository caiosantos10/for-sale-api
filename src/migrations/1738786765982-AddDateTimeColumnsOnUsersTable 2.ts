import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateTimeColumnsOnUsersTable1738786765982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE IF EXISTS "Users"
            ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE IF EXISTS "Users"
            DROP COLUMN IF EXISTS created_at,
            DROP COLUMN IF EXISTS updated_at,
        `);
    }

}
