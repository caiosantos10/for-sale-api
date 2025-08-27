import AppError from "@shared/errors/AppError";
import Merchant from "../entities/Merchant";
import MerchantRepository from "../repositories/MerchantRepository";

interface IRequest {
    id: string;
}

export default class FindOneMerchantService {
    public async execute({ id }: IRequest): Promise<Merchant> {
        const Merchant = await MerchantRepository.findOne({ where: { id } });

        if (!Merchant) throw new AppError('Merchant not found.');

        return Merchant;
    }
}