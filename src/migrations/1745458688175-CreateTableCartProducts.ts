import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCartProducts1745458688175 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "CartProducts" (
                id UUID PRIMARY KEY NOT NULL,
                cart_id UUID NOT NULL,
                product_id UUID NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_cartProducts_cart FOREIGN KEY (cart_id) REFERENCES "Cart"(id) ON DELETE CASCADE,
                CONSTRAINT fk_cartProducts_product FOREIGN KEY (product_id) REFERENCES "Products"(id)
            );
    
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
