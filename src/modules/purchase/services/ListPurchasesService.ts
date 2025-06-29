import { PageList } from "@shared/interfaces/page-list.interface";
import PurchaseRepository from "../repositories/PurchaseRepository";
import { PurchaseResponseDTO } from "../utils/purchase.dto";

interface IRequest {
    userId: string;
    page: number;
    perPage: number;
}

export default class ListPurchasesService {
    public async execute({ userId, page, perPage }: IRequest): Promise<PageList<PurchaseResponseDTO>> {
        const [purchases, total] = await PurchaseRepository
            .createQueryBuilder('purchase')
            .leftJoinAndSelect('purchase.purchaseProducts', 'purchaseProduct')
            .leftJoinAndSelect('purchaseProduct.product', 'product')
            .leftJoinAndSelect('purchase.paymentMethod', 'paymentMethod')
            .where('purchase.user_id = :userId', { userId })
            .skip((page - 1) * perPage)
            .take(perPage)
            .getManyAndCount();

        
        const purchaseList = purchases.map(item => ({
            id: item.id,
            user_id: userId,
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

        return {
            data: purchaseList,
            total,
            page,
            lastPage: Math.ceil(total / perPage),
        };
    }
}