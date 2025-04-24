import Users from "@modules/users/entities/Users";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity('Carts')
export default class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'user_id' })
    @Column()
    user_id: string;

    // @Column()
    // product_ids: string[]; 

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}