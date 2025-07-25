import AppError from "@shared/errors/AppError";
import { CartResponseDTO } from "../utils/cart.dto";
import { ICartRepository } from "@shared/interfaces/repositories.interface";
import CartProducts from "../entities/CartProducts";

interface IRequest {
    id: string;
}

export default class FindOneCartService {
    constructor(private cartRepository: ICartRepository) { }

    public async execute({ id }: IRequest): Promise<CartResponseDTO> {
        const cart = await this.cartRepository.findOne({
            where: { id },
            relations: ['cartProducts', 'cartProducts.product']
        });

        if (!cart) throw new AppError('Cart not found.');

        return {
            id: cart.id,
            user_id: cart.user_id,
            products: cart.cartProducts.map((cartProduct: CartProducts) => ({
                id: cartProduct.product.id,
                name: cartProduct.product.name,
                description: cartProduct.product.name,
                price: cartProduct.product.price,
                image: cartProduct.product.image,
                quantity: cartProduct.quantity,
                observations: cartProduct.observations,
            })),
        };
    }
}
