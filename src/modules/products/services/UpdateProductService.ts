import AppError from "@shared/errors/AppError";
import Product from "../entities/Product";
import ProductRepository from "../repositories/ProductRepository";

interface IRequest {
    id: string;
    name: string;
    description : string;
    price: number;
}

export default class UpdateProductService {
    public async execute({ id, name, description, price }: IRequest): Promise<Product> {
        const product = await ProductRepository.findOne({ where: { id } });

        if (!product) throw new AppError('Product not found.');

        product.name = name;
        product.description = description;
        product.price = price;

        await ProductRepository.save(product);

        return product;
    }
}