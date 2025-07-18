import AppError from "@shared/errors/AppError";
import ProductRepository from "../repositories/ProductRepository";

interface IRequest {
    id: string;
}

export default class DeleteProductService {
    public async execute({ id }: IRequest): Promise<void> {
        const product = await ProductRepository.findOne({ where: { id } });

        if (!product) throw new AppError('Product not found.');

        await ProductRepository.remove(product);
    }
}