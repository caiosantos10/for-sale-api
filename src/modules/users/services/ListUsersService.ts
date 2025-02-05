import User from "../entities/Users";
import UsersRepository from "../repositories/UsersRepository";

export default class ListUsersService {
    public async execute(): Promise<User[]> {
        const users = await UsersRepository.find();
        
        return users;
    }
}