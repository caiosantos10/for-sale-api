import { AppDataSource } from "@config/typeorm"
import { Address } from "../entities/Address";

const AddressRepository = AppDataSource.getRepository(Address).extend({
    findByUser(user_id: string): Promise<Address | null> {
        return this.findOne({ where: { user: { id: user_id } } });
    }
});

export default AddressRepository;