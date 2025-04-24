import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import Cart from "../entities/Cart";
import CartProductsRepository from "../repositories/CartProductsRepository";

interface IRequest {
    user_id: string;
    product_ids : string[];
}

export default class CreateCartService {
    public async execute({ user_id, product_ids }: IRequest): Promise<Cart> {
        if (product_ids.length <= 0) {
            throw new AppError('You must pass one or more products to create a Cart.', 400);
        }
        
        // Criar um Cart
        const cart = CartRepository.create({ user_id });
        await CartRepository.save(cart);

        // Criar um registro de CartProducts para cada produto adicionado no carrinho
        const cartProducts = product_ids.map(product_id => CartProductsRepository.create({
            cart_id: cart.id,
            product_id,
        }));
        await CartProductsRepository.save(cartProducts);

        return cart;
    }
}