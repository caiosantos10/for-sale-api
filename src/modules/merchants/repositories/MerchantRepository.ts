import { AppDataSource } from "src/config/typeorm"
import Merchant from "../entities/Merchant";

const MerchantRepository = AppDataSource.getRepository(Merchant).extend({});

export default MerchantRepository;