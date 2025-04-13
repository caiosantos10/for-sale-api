import { AppDataSource } from "src/config/typeorm"
import UserTokens from "../entities/UserTokens";

const UserTokensRepository = AppDataSource.getRepository(UserTokens).extend({
    async findByToken(token: string): Promise<UserTokens | null> {
        return this.findOne({ where: { token } });
    },
    async generate(user_id: string): Promise<UserTokens | null> {
        const userToken = await this.create({ user_id });

        try {
            await this
                .createQueryBuilder()
                .delete()
                .from(UserTokens)
                .where("user_id = :user_id", { user_id })
                .execute()
            
            await this.save(userToken);
        } catch (err) {
            console.error(err)
        }
        return userToken;
        
    }
});

export default UserTokensRepository;