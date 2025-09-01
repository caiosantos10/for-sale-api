import AppError from "@shared/errors/AppError";
import CartRepository from "../repositories/CartRepository";

interface IRequest {
    id: string;
}

export default class DeleteCartService {
    constructor() { }

    public async execute({ id }: IRequest): Promise<void> {
        const cart = await CartRepository.findOne({ where: { id } });

        if (!cart) {
            throw new AppError('Cart not found.');
        }

        await CartRepository.remove(cart);
    }
}
