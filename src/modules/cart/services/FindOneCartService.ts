import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import { CartResponseDTO } from "../utils/cart.dto";

interface IRequest {
    id: string;
}

export default class FindOneCartService {
    public async execute({ id }: IRequest): Promise<CartResponseDTO> {
        const cart = await CartRepository.findOne({
            where: { id },
            relations: ['cartProducts', 'cartProducts.product']
        });

        if (!cart) throw new AppError('Cart not found.');

         const cartResponse: CartResponseDTO = {
            id: cart.id,
            user_id: cart.user_id,
            products: cart?.cartProducts.map(cartProduct => ({
                id: cartProduct.product.id,
                name: cartProduct.product.name,
                description: cartProduct.product.name,
                price: cartProduct.product.price,
                image: cartProduct.product.image,
                quantity: cartProduct.quantity,
                observations: cartProduct.observations,
            })) ?? [],
        };

        return cartResponse;
    }
}