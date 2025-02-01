import { AppDataSource } from "src/config/typeorm"
import Product from "../entities/Product"

const ProductRepository = AppDataSource.getRepository(Product).extend({
    findByName(name: string): Promise<Product | null> {
        return this.findOne({ where: { name } });
    }
});

export default ProductRepository;