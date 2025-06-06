import PurchaseRepository from "../repositories/PurchaseRepository";
import { PurchaseResponseDTO } from "../utils/purchase.dto";

export default class ListPurchasesService {
    public async execute(): Promise<PurchaseResponseDTO[]> {
        const purchases = await PurchaseRepository
            .createQueryBuilder('purchase')
            .leftJoinAndSelect('purchase.purchaseProducts', 'purchaseProduct')
            .leftJoinAndSelect('purchaseProduct.product', 'product')
            .leftJoinAndSelect('purchase.paymentMethod', 'paymentMethod')
            .getMany();

        
        return purchases.map(item => ({
            id: item.id,
            user_id: item.user_id,
            products: item.purchaseProducts?.map(pp => ({
                id: pp.product.id,
                name: pp.product.name,
                description: pp.product.description,
                price: pp.product.price,
                image: pp.product.image,
                quantity: pp.quantity,
                observations: pp.observations,
            })) ?? [],
            status: item.status,
            delivery_address: item.delivery_address,
            payment_method: {
                id: item.paymentMethod.id,
                method: item.paymentMethod.method,
                installments: item.paymentMethod.installments,
                cardBrand: item.paymentMethod.card_brand,
            }
        }));
    }
}