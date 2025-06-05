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
    card_brand: string;

    @OneToOne(() => Purchase, (purchase) => purchase.paymentMethod, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'purchase_id' })
    purchase: Purchase;

    @Column()
    purchase_id: string;
}
