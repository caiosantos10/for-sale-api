import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCart1745012494060 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "Carts"(
                id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES "Users"(id)
            );

            CREATE TABLE IF NOT EXISTS "CartProducts" (
                id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
                cart_id UUID NOT NULL,
                product_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_cartProducts_cart FOREIGN KEY (cart_id) REFERENCES "Carts"(id) ON DELETE CASCADE,
                CONSTRAINT fk_cartProducts_product FOREIGN KEY (product_id) REFERENCES "Products"(id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "Carts"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "CartProducts"`);
    }

}
