import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import { CartResponseDTO } from "../utils/cart-response.dto";

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
            created_at: cart.created_at,
            updated_at: cart.updated_at,
            products: cart?.cartProducts.map(cartProduct => (cartProduct.product)) ?? [],
        };

        return cartResponse;
    }
}