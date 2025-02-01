import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProducts1738201565507 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS Products(
                id UUID PRIMARY KEY NOT NULL,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(200),
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS Products`);
    }

}
