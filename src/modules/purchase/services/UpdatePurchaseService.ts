import AppError from "src/shared/errors/AppError";
import PurchaseRepository from "../repositories/PurchaseRepository";
import PurchaseStatus from "../utils/purchaseStatus.enum";
import Purchase from "../entities/Purchase";

interface IRequest {
    id: string;
    status: PurchaseStatus;
}

export default class UpdatePurchaseService {
    public async execute({ id, status }: IRequest): Promise<Purchase> {
        const purchase = await PurchaseRepository.findOne({ where: { id } });

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

