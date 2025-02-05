import { AppDataSource } from "src/config/typeorm"
import User from "../entities/Users"

const UsersRepository = AppDataSource.getRepository(User).extend({
    findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }
});

export default UsersRepository;