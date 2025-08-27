import Merchant from "@modules/merchants/entities/Merchant";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Products')
export default class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal')
    price: number;

    @Column()
    image: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column({ name: "merchant_id", type: "uuid" })
    merchantId: string;

    @ManyToOne(() => Merchant, (c) => c.products, { onDelete: "CASCADE" })
    @JoinColumn({ name: "merchant_id" })
    merchant: Merchant;
}