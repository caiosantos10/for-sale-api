import AppError from "src/shared/errors/AppError";
import Cart from "../entities/Cart";
import CartRepository from "../repositories/CartRepository";
import CartProductsRepository from "../repositories/CartProductsRepository";

interface IRequest {
    id: string;
    product_ids: string[];
}

export default class UpdateCartService {
    public async execute({ id, product_ids }: IRequest): Promise<Cart> {
        const cart = await CartRepository.findOne({ where: { id } });

        if (!cart) throw new AppError('Cart not found.');

        // Remover todos os itens de CartProducts de acordo com o id do carrinho em questão
        const itemsToRemove = await CartProductsRepository.findBy({ cart_id: id });
        await CartProductsRepository.remove(itemsToRemove);

        // Criar registros de CartProducts para cada product_id informado
        const itemsToAdd = product_ids.map(product_id => CartProductsRepository.create({
            cart_id: cart.id,
            product_id,
        }));
        await CartProductsRepository.save(itemsToAdd);

        await CartRepository.save(cart);

        return cart;
    }
}