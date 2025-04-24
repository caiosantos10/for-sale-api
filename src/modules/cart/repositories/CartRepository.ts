import { AppDataSource } from "src/config/typeorm"
import Cart from "../entities/Cart";

const CartRepository = AppDataSource.getRepository(Cart).extend({
    findByUser(user_id: string): Promise<Cart | null> {
        return this.findOne({ where: { user_id } });
    }
});

export default CartRepository;