import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import CartProductsRepository from "../repositories/CartProductsRepository";
import ProductRepository from "@modules/products/repositories/ProductRepository";
import { In } from "typeorm";
import { CartResponseDTO } from "../utils/cart-response.dto";

interface IRequest {
    id: string;
    product_ids: string[];
}

export default class UpdateCartService {
    public async execute({ id, product_ids }: IRequest): Promise<CartResponseDTO> {
        const cart = await CartRepository.findOne({ where: { id } });

        if (!cart) throw new AppError('Cart not found.');

        // Remover todos os itens de CartProducts de acordo com o id do carrinho em questão
        const itemsToRemove = await CartProductsRepository.findBy({ cart_id: id });
        await CartProductsRepository.remove(itemsToRemove);

        // Validar se todos os produtos existem
        const products = await ProductRepository.findBy({ id: In(product_ids) });
        if (products.length !== product_ids.length) {
            throw new Error('One or more products not found');
        }

        // Criar registros de CartProducts para cada product_id informado
        const itemsToAdd = products.map(product => CartProductsRepository.create({
            cart_id: cart.id,
            product_id: product.id,
        }));
        await CartProductsRepository.save(itemsToAdd);
        await CartRepository.save(cart);

        // Buscar novamente o cart completo, já com products
        const cartComplete = await CartRepository.findOne({
            where: { id: cart.id },
            relations: ['cartProducts', 'cartProducts.product'],
        });

        const cartResponse: CartResponseDTO = {
            id: cart.id,
            user_id: cart.user_id,
            created_at: cart.created_at,
            updated_at: cart.updated_at,
            products: cartComplete?.cartProducts.map(cartProduct => (cartProduct.product)) ?? [],
        };

        return cartResponse;
    }
}