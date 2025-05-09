import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCartProductsAddQuantityAndObservations1745958805378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'CartProducts' AND column_name = 'quantity'
                ) THEN RAISE NOTICE 'Column quantity already exists.';
                ELSE
                    ALTER TABLE "CartProducts"
                    ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;
                END IF;

                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'CartProducts' AND column_name = 'observations'
                ) THEN RAISE NOTICE 'Coluna observations já existe. Não será criada.';
                ELSE
                    ALTER TABLE "CartProducts"
                    ADD COLUMN observations TEXT;
                END IF;
            END
            $$;   
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'CartProducts' AND column_name = 'quantity'
                ) THEN
                    ALTER TABLE "CartProducts"
                    DROP COLUMN quantity;
                END IF;

                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'CartProducts' AND column_name = 'observations'
                ) THEN
                    ALTER TABLE "CartProducts"
                    DROP COLUMN observations;
                END IF;
            END
            $$;
        `);
    }
}
