import AppError from "@shared/errors/AppError";
import Merchant from "../entities/Merchant";
import MerchantRepository from "../repositories/MerchantRepository";

interface IRequest {
    id: string;
    legal_name: string;
    trade_name: string;
    cnpj: string;
    contact_email: string;
    phone: string;
}

export default class UpdateMerchantService {
    public async execute({ id, legal_name, trade_name, cnpj, contact_email, phone }: IRequest): Promise<Merchant> {
        const merchant = await MerchantRepository.findOne({ where: { id } });

        if (!merchant) throw new AppError('Merchant not found.');

        merchant.legal_name = legal_name;
        merchant.trade_name = trade_name;
        merchant.cnpj = cnpj;
        merchant.contact_email = contact_email;
        merchant.phone = phone;

        await MerchantRepository.save(merchant);

        return merchant;
    }
}