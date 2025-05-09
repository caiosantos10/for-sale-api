import Purchase from "../entities/Purchase";
import PurchaseRepository from "../repositories/PurchaseRepository";

export default class ListPurchasesService {
    public async execute(): Promise<Purchase[]> {
        const Purchases = await PurchaseRepository.find();
        
        return Purchases;
    }
}