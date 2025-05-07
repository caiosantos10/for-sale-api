import { AppDataSource } from "src/config/typeorm"
import PurchaseProducts from "../entities/PurchaseProducts";

const PurchaseProductsRepository = AppDataSource.getRepository(PurchaseProducts).extend({
    findByPurchase(purchase_id: string): Promise<PurchaseProducts | null> {
        return this.findOne({ where: { purchase_id } });
    }
});

export default PurchaseProductsRepository;