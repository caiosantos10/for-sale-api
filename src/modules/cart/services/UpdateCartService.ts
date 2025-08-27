import AppError from "@shared/errors/AppError";
import { ICartRepository, ICartProductsRepository, IProductRepository } from "@shared/interfaces/repositories.interface";
import { In } from "typeorm";
import { CartResponseDTO } from "../utils/cart.dto";
import CartProducts from "../entities/CartProducts";
import CartRepository from "../repositories/CartRepository";
import CartProductsRepository from "../repositories/CartProductsRepository";
import ProductRepository from "@modules/products/repositories/ProductRepository";

interface ProductsDTO {
    id: string;
    quantity?: number;
    observations?: string;
}

interface IRequest {
    cart_id: string;
    products: ProductsDTO[];
}

export default class UpdateCartService {
    constructor(
        // private cartRepository: ICartRepository,
        // private cartProductsRepository: ICartProductsRepository,
        // private productRepository: IProductRepository
    ) { }

    public async execute({ cart_id, products }: IRequest): Promise<CartResponseDTO> {
        const product_ids = products.map(product => product.id);
        const cart = await CartRepository.findOne({ where: { id: cart_id } });

        if (!cart) throw new AppError('Cart not found.');

        const itemsToRemove = await CartProductsRepository.findBy({ cart_id });
        await CartProductsRepository.remove(itemsToRemove);

        const foundedProducts = await ProductRepository.findBy({ id: In(product_ids) });
        if (foundedProducts.length !== product_ids.length) {
            throw new Error('One or more products not found');
        }

        const itemsToAdd = foundedProducts.map((product: ProductsDTO, index: number) =>
            CartProductsRepository.create({
                cart_id: cart.id,
                product_id: product.id,
                quantity: products[index].quantity,
                observations: products[index].observations,
            })
        );

        await CartProductsRepository.save(itemsToAdd);
        await CartRepository.save(cart);

        const cartComplete = await CartRepository.findOne({
            where: { id: cart.id },
            relations: ['cartProducts', 'cartProducts.product'],
        });

        return {
            id: cart.id,
            user_id: cart.user_id,
            products:
                cartComplete?.cartProducts.map((cartProduct: CartProducts) => ({
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
}
