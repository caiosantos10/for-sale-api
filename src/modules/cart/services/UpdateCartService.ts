import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import CartProductsRepository from "../repositories/CartProductsRepository";
import ProductRepository from "@modules/products/repositories/ProductRepository";
import { In } from "typeorm";
import { CartResponseDTO } from "../utils/cart.dto";

interface ProductsDTO {
    id: string;
    quantity?: number;
    observations?: string;
}
interface IRequest {
    cart_id: string;
    products: ProductsDTO[]
}

export default class UpdateCartService {
    public async execute({ cart_id, products }: IRequest): Promise<CartResponseDTO> {
        const product_ids = products.map(product => product.id);
        const cart = await CartRepository.findOne({ where: { id: cart_id } });

        if (!cart) throw new AppError('Cart not found.');

        // Remover todos os itens de CartProducts de acordo com o id do carrinho em questão
        const itemsToRemove = await CartProductsRepository.findBy({ cart_id });
        await CartProductsRepository.remove(itemsToRemove);

        // Validar se todos os produtos existem
        const foundedProducts = await ProductRepository.findBy({ id: In(product_ids) });
        if (foundedProducts.length !== product_ids.length) {
            throw new Error('One or more products not found');
        }

        // Criar registros de CartProducts para cada product_id informado
        const itemsToAdd = foundedProducts.map((product, index) => CartProductsRepository.create({
            cart_id: cart.id,
            product_id: product.id,
            quantity: products[index].quantity,
            observations: products[index].observations,
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

        return cartResponse;
    }
}