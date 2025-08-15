import AppError from "@shared/errors/AppError";
import PurchaseRepository from "../repositories/PurchaseRepository";
import PurchaseStatus from "../utils/purchaseStatus.enum";
import Purchase from "../entities/Purchase";

interface IRequest {
    id: string;
    status: PurchaseStatus;
    userId: string;
}

export default class UpdatePurchaseService {
    public async execute({ id, status, userId }: IRequest): Promise<Purchase> {
        const purchase = await PurchaseRepository.findOne({
            where: {
                id,
                user: { id: userId }
            }
        });

        if (!purchase) throw new AppError('Purchase not found.');

        if (!this.isValidPurchaseStatus(status)) throw new AppError('Invalid status.');

        purchase.status = status;

        await PurchaseRepository.save(purchase);

        return purchase;
    }

    isValidPurchaseStatus(value: PurchaseStatus) {
        return Object.values(PurchaseStatus).includes(value);
    }
}

