import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import Cart from "../entities/Cart";

interface IRequest {
    id: string;
}

export default class FindOneCartService {
    public async execute({ id }: IRequest): Promise<Cart> {
        const cart = await CartRepository.findOne({ where: { id } });

        if (!cart) throw new AppError('Cart not found.');

        return cart;
    }
}