import AppError from "src/shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";
import Cart from "../entities/Cart";

interface IRequest {
    user_id: string;
}

export default class GetByUserCartService {
    public async execute({ user_id }: IRequest): Promise<Cart> {
        const cart = await CartRepository.findOne({ where: { user_id } });

        if (!cart) throw new AppError('Cart not found.');

        return cart;
    }
}