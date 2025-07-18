import AppError from "@shared/errors/AppError";
import ProductRepository from "../repositories/ProductRepository";
import Product from "../entities/Product";

interface IRequest {
    name: string;
    description : string;
    price: number;
}

export default class CreateProductService {
    public async execute({ name, description, price }: IRequest): Promise<Product> {
        const productExists = await ProductRepository.findByName(name);

        if (productExists) throw new AppError('There is already one product with this name');

        const product = ProductRepository.create({
            name,
            description,
            price,
        });

        await ProductRepository.save(product);

        return product;
    }
}