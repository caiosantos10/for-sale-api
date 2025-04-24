import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Carts')
export default class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    // @Column()
    // product_ids: string[]; 

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}