import AppError from "@shared/errors/AppError";
import { CartResponseDTO, ProductsRequestDTO } from "../utils/cart.dto";
import { In } from "typeorm";
import UpdateCartService from "./UpdateCartService";
import CartProducts from "../entities/CartProducts";
import {
    ICartProductsRepository,
    ICartRepository,
    IProductRepository
} from "@shared/interfaces/repositories.interface";
import CartRepository from "../repositories/CartRepository";
import ProductRepository from "@modules/products/repositories/ProductRepository";
import CartProductsRepository from "../repositories/CartProductsRepository";

interface IRequest {
    user_id: string;
    products: ProductsRequestDTO[];
}

export default class CreateCartService {
    constructor(
        // private cartRepository: ICartRepository,
        // private productRepository: IProductRepository,
        // private cartProductsRepository: ICartProductsRepository,
        // private updateCartService: UpdateCartService
    ) { }

    public async execute({ user_id, products }: IRequest): Promise<CartResponseDTO> {
        const product_ids = products.map(product => product.id);
        if (product_ids.length <= 0) {
            throw new AppError('You must pass one or more products to create a Cart.', 400);
        }

        let cartResponse: CartResponseDTO;

        const cartAlreadyExists = await CartRepository.findOne({ where: { user_id } });
        /** Caso já exista, não cria, mas atualiza */
        if (cartAlreadyExists) {
            const updateCartService = new UpdateCartService();
            cartResponse = await updateCartService.execute({
                cart_id: cartAlreadyExists.id,
                products,
            });
        } else {
            const cart = CartRepository.create({ user_id });
            await CartRepository.save(cart);

            const foundedProducts = await ProductRepository.findBy({
                id: In(product_ids),
            });

            if (foundedProducts.length !== product_ids.length) {
                throw new AppError('One or more products not found', 404);
            }

            const cartProducts = foundedProducts.map((product: ProductsRequestDTO, index: number) =>
                CartProductsRepository.create({
                    cart_id: cart.id,
                    product_id: product.id,
                    quantity: products[index].quantity,
                    observations: products[index].observations,
                })
            );

            await CartProductsRepository.save(cartProducts);

            const cartComplete = await CartRepository.findOne({
                where: { id: cart.id },
                relations: ['cartProducts', 'cartProducts.product'],
            });

            cartResponse = {
                id: cart.id,
                user_id: cart.user_id,
                products: cartComplete?.cartProducts.map((cartProduct: CartProducts) => ({
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
