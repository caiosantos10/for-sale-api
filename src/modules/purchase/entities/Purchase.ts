import Cart from "@modules/cart/entities/Cart";
import User from "@modules/users/entities/Users";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from "typeorm";

@Entity('Purchase')
export default class Purchase {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cart_id: string;

    @Column()
    user_id: string;

    @ManyToOne(() => Cart)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
