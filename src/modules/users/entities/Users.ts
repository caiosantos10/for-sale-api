import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import RoleEnum from "../shared/enums/Role.enum";

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
        type: 'enum', // Define o tipo da coluna como enum
        enum: RoleEnum, // Passa a enumeração
        default: RoleEnum.Customer, // Define um valor padrão, se necessário
    })
    role: RoleEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}