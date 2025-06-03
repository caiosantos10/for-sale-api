import Users from "@modules/users/entities/Users";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne, 
    JoinColumn,
    OneToMany,
    OneToOne
} from "typeorm";
import PurchaseProducts from "./PurchaseProducts";
import { PaymentMethods } from "./PaymentMethods";

@Entity('Purchase')
export default class Purchase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    @Column()
    user_id: string;

    @Column()
    status: string;

    @OneToMany(() => PurchaseProducts, (purchaseProduct) => purchaseProduct.purchase)
    purchaseProducts: PurchaseProducts[];

    @Column()
    delivery_address: string;

    @OneToOne(() => PaymentMethods, (paymentMethods) => paymentMethods.purchase)
    payment_method: PaymentMethods;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
