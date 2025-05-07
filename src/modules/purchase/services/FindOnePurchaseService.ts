import AppError from "src/shared/errors/AppError";
import PurchaseRepository from "../repositories/PurchaseRepository";
import { PurchaseResponseDTO } from "../utils/purchase.dto";

interface IRequest {
    id: string;
}

export default class FindOnePurchaseService {
    public async execute({ id }: IRequest): Promise<PurchaseResponseDTO> {
        const purchase = await PurchaseRepository.findOne({
            where: { id },
            relations: ['purchaseProducts', 'purchaseProducts.product']
        });

        if (!purchase) throw new AppError('Purchase not found.');

        const PurchaseResponse: PurchaseResponseDTO = {
            id: purchase.id,
            user_id: purchase.user_id,
            products: purchase?.purchaseProducts.map(purchaseProduct => ({
                id: purchaseProduct.product.id,
                name: purchaseProduct.product.name,
                description: purchaseProduct.product.name,
                price: purchaseProduct.product.price,
                image: purchaseProduct.product.image,
                quantity: purchaseProduct.quantity,
                observations: purchaseProduct.observations,
            })) ?? [],
            status: purchase.id,
        };

        return PurchaseResponse;
    }
}