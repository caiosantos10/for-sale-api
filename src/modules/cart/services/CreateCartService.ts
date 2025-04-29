import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import CartProductsRepository from "../repositories/CartProductsRepository";
import { CartResponseDTO, ProductsRequestDTO } from "../utils/cart.dto";
import ProductRepository from "@modules/products/repositories/ProductRepository";
import { In } from "typeorm";
import UpdateCartService from "./UpdateCartService";

interface IRequest {
    user_id: string;
    products: ProductsRequestDTO[]
}

export default class CreateCartService {
    public async execute({ user_id, products }: IRequest): Promise<CartResponseDTO> {
        const product_ids = products.map(product => product.id);
        if (product_ids.length <= 0) {
            throw new AppError('You must pass one or more products to create a Cart.', 400);
        }

        let cartResponse: CartResponseDTO;

        // If there is a cart by user, update it with product ids
        const cartAlreadyExists = await CartRepository.findOne({ where: { user_id } });
        if (cartAlreadyExists) {
            const updateCartService = new UpdateCartService()
            cartResponse = await updateCartService.execute({
                cart_id: cartAlreadyExists.id,
                products,
            });
        } else {
            // If there is no cart by user, create one
            const cart = CartRepository.create({ user_id });
            await CartRepository.save(cart);

            // Valid if all products exist
            const foundedProducts = await ProductRepository.findBy({ id: In(product_ids) });
            if (foundedProducts.length !== product_ids.length) {
                throw new Error('One or more products not found');
            }

            // Create a CartProducts for each Product 
            const cartProducts = foundedProducts.map((product, index) => CartProductsRepository.create({
                cart_id: cart.id,
                product_id: product.id,
                quantity: products[index].quantity,
                observations: products[index].observations,
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
                products: cartComplete?.cartProducts.map(cartProduct => ({
                    id: cartProduct.product.id,
                    name: cartProduct.product.name,
                    description: cartProduct.product.name,
                    price: cartProduct.product.price,
                    image: cartProduct.product.image,
                    quantity: cartProduct.quantity,
                    observations: cartProduct.observations,
                })) ?? [],
            };
        }

        return cartResponse;

    }
}