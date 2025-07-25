import AppError from "@shared/errors/AppError";
import { ICartRepository } from "@shared/interfaces/repositories.interface";

interface IRequest {
    id: string;
}

export default class DeleteCartService {
    constructor(private cartRepository: ICartRepository) { }

    public async execute({ id }: IRequest): Promise<void> {
        const cart = await this.cartRepository.findOne({ where: { id } });

        if (!cart) {
            throw new AppError('Cart not found.');
        }

        await this.cartRepository.remove(cart);
    }
}
