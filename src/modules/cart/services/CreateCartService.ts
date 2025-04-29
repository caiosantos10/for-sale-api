import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import CartProductsRepository from "../repositories/CartProductsRepository";
import { CartResponseDTO } from "../utils/cart-response.dto";
import ProductRepository from "@modules/products/repositories/ProductRepository";
import { In } from "typeorm";
import UpdateCartService from "./UpdateCartService";

interface IRequest {
    user_id: string;
    product_ids : string[];
}

export default class CreateCartService {
    public async execute({ user_id, product_ids }: IRequest): Promise<CartResponseDTO> {
        if (product_ids.length <= 0) {
            throw new AppError('You must pass one or more products to create a Cart.', 400);
        }

        let cartResponse: CartResponseDTO;

        // If there is a cart by user, update it with product ids
        const cartAlreadyExists = await CartRepository.findOne({ where: { user_id } });
        if (cartAlreadyExists) {
            const updateCartService = new UpdateCartService()
            cartResponse = await updateCartService.execute({
                id: cartAlreadyExists.id,
                product_ids,
            });
        } else {
            // If there is no cart by user, create one
            const cart = CartRepository.create({ user_id });
            await CartRepository.save(cart);

            // Valid if all products exist
            const products = await ProductRepository.findBy({ id: In(product_ids) });
            if (products.length !== product_ids.length) {
                throw new Error('One or more products not found');
            }

            // Create a CartProducts for each Product 
            const cartProducts = products.map(product => CartProductsRepository.create({
                cart_id: cart.id,
                product_id: product.id,
            }));
            await CartProductsRepository.save(cartProducts);

            // Get the whole Cart with Products attached
            const cartComplete = await CartRepository.findOne({
                where: { id: cart.id },
                relations: ['cartProducts', 'cartProducts.product'],
            });

            cartResponse = {
                id: cart.id,
                user_id: cart.user_id,
                created_at: cart.created_at,
                updated_at: cart.updated_at,
                products: cartComplete?.cartProducts.map(cartProduct => (cartProduct.product)) ?? [],
            };
        }

        return cartResponse;

    }
}