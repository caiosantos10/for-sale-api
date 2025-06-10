import { AppDataSource } from "src/config/typeorm"
import Purchase from "../entities/Purchase";

const PurchaseRepository = AppDataSource.getRepository(Purchase).extend({
    findByUser(userId: string): Promise<Purchase | null> {
        return this.findOne({ where: { user: { id: userId } } });
    }
});

export default PurchaseRepository;