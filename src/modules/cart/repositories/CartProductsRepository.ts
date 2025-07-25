import { AppDataSource } from "@config/typeorm"
import CartProducts from "../entities/CartProducts";

const CartProductsRepository = AppDataSource.getRepository(CartProducts).extend({
    findByCart(cart_id: string): Promise<CartProducts | null> {
        return this.findOne({ where: { cart_id } });
    }
});

export default CartProductsRepository;