import { AppDataSource } from "src/config/typeorm"
import Purchase from "../entities/Purchase";

const PurchaseRepository = AppDataSource.getRepository(Purchase).extend({
    findByUser(user_id: string): Promise<Purchase | null> {
        return this.findOne({ where: { user_id } });
    }
});

export default PurchaseRepository;