import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import Purchase from './Purchase';

@Entity('PaymentMethods')
export class PaymentMethods {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    method: string; // Ex: 'credit_card', 'pix', 'boleto'

    @Column({ nullable: true })
    installments: number;

    @Column({ nullable: true })
    cardBrand: string;

    @OneToOne(() => Purchase, (purchase) => purchase.payment_method, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'purchase_id' })
    purchase: Purchase;
}
