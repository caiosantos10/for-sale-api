import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import RoleEnum from "../shared/enums/Role.enum";
import { Address } from "./Address";

@Entity('Users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.Customer,
    })
    role: RoleEnum;

    @OneToMany(() => Address, address => address.user_id)
    addresses: Address[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}