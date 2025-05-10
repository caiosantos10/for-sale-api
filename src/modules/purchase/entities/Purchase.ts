import Users from "@modules/users/entities/Users";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne, 
    JoinColumn,
    OneToMany
} from "typeorm";
import PurchaseProducts from "./PurchaseProducts";

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
