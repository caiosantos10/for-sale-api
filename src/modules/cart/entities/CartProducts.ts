import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import Cart from "./Cart";
import Product from "@modules/products/entities/Product";


@Entity('CartProducts')
export default class CartProducts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cart_id: string;

    @Column()
    product_id: string;

    @ManyToOne(() => Cart)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
