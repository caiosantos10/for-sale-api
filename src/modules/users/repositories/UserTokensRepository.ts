import { AppDataSource } from "src/config/typeorm"
import UserTokens from "../entities/UserTokens";

const UserTokensRepository = AppDataSource.getRepository(UserTokens).extend({
    async findByToken(token: string): Promise<UserTokens | null> {
        return this.findOne({ where: { token } });
    },
    async generate(user_id: string): Promise<UserTokens | null> {
        const userToken = await this.create({ user_id });

        await this.save(userToken);
        
        return userToken;
    }
});

export default UserTokensRepository;