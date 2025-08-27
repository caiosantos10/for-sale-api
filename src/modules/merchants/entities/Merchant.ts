import Product from "@modules/products/entities/Product";
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn} from "typeorm";

@Entity('Merchants')
export default class Merchant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    legal_name: string; // razão social

    @Column()
    trade_name: string; // nome fantasia

    @Column()
    cnpj: string;

    @Column()
    contact_email: string

    @Column()
    phone: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => Product, (p) => p.merchant)
    products: Product[];
}
