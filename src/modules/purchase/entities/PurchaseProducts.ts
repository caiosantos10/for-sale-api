import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import Purchase from "./Purchase";
import Product from "../../products/entities/Product";


@Entity('PurchaseProducts')
export default class PurchaseProducts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    purchase_id: string;

    @Column()
    product_id: string;

    @ManyToOne(() => Purchase)
    @JoinColumn({ name: 'purchase_id' })
    purchase: Purchase;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    quantity: number;

    @Column()
    observations: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
