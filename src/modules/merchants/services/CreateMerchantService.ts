import AppError from "@shared/errors/AppError";
import MerchantRepository from "../repositories/MerchantRepository";

export interface IRequest {
    legal_name: string;
    trade_name: string;
    cnpj: string;
    contact_email: string;
    phone: string;
  }

export default class CreateMerchantService {
    public async execute({ legal_name, trade_name, cnpj, contact_email, phone }: IRequest): Promise<any> {
        const merchantExists = await MerchantRepository.findOne({ where: { legal_name } });

        if (merchantExists) throw new AppError('There is already one Merchant with this Legal Name');

        const merchant = MerchantRepository.create({
            legal_name,
            trade_name,
            cnpj,
            contact_email,
            phone
        });

        await MerchantRepository.save(merchant);

        return merchant;

    }
}