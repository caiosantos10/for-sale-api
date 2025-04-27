import Users from '../../users/entities/Users';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import CartProducts from './CartProducts';

@Entity('Carts')
export default class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    @Column()
    user_id: string;

    @OneToMany(() => CartProducts, (cartProduct) => cartProduct.cart)
    cartProducts: CartProducts[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}