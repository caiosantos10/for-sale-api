import { AppDataSource } from "src/config/typeorm"
import { PaymentMethods } from "../entities/PaymentMethods";

const PaymentMethodsRepository = AppDataSource.getRepository(PaymentMethods).extend({
    // findByPurchase(purchase_id: string): Promise<PurchaseProducts | null> {
    //     return this.findOne({ where: { purchase_id } });
    // }
});

export default PaymentMethodsRepository;