import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumnToUser1738784014300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE TYPE role_enum AS ENUM ('ADMIN', 'CUSTOMER');
        `);
        queryRunner.query(`
            ALTER TABLE IF EXISTS "Users"
            ADD COLUMN "role" role_enum NOT NULL DEFAULT 'CUSTOMER';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            ALTER TABLE IF EXISTS "Users"
            DROP COLUMN IF EXISTS "role"    
        `);
    }

}
