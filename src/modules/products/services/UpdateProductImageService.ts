import AppError from "@shared/errors/AppError";
import ProductRepository from "../repositories/ProductRepository";
import path from 'path';
import uploadConfig from '@config/upload';
import Product from "../entities/Product";
import { fileExists, removeFile } from "@shared/utils/file-utils";

interface IRequest {
    productId: string;
    imageFileName: string;
}

export default class UpdateProductImageService {
    public async execute({ imageFileName, productId }: IRequest): Promise<Product> {
        const product = await ProductRepository.findOne({ where: { id: productId  } });

        if (!product) throw new AppError('Product not found.', 404);
        
        if (product.image) {
            const filePath = path.join(uploadConfig.directory, product.image);
            
            // Verifica se arquivo existe
            const imageExists = await fileExists(filePath);

            // Caso arquivo exista, apaga-o
            if (imageExists) {
                await removeFile(filePath)
            }
        }   

        product.image = imageFileName;

        await ProductRepository.save(product);

        return product;
    }
}