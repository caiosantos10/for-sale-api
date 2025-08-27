import AppError from "@shared/errors/AppError";
import MerchantRepository from "../repositories/MerchantRepository";

interface IRequest {
    id: string;
}

export default class DeleteMerchantService {
    public async execute({ id }: IRequest): Promise<void> {
        const merchant = await MerchantRepository.findOne({ where: { id } });

        if (!merchant) throw new AppError('Merchant not found.');

        await MerchantRepository.remove(merchant);
    }
}