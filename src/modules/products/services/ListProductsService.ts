import Product from "../entities/Product";
import ProductRepository from "../repositories/ProductRepository";

export default class ListProductsService {
    public async execute(): Promise<Product[]> {
        const products = await ProductRepository.find();
        
        return products;
    }
}