import { PageList } from "@shared/interfaces/page-list.interface";
import User from "../entities/Users";
import UsersRepository from "../repositories/UsersRepository";

const page = 1;
const perPage = 10;

export default class ListUsersService {
    public async execute(): Promise<PageList<User>> {
        const [users, total] = await UsersRepository.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage,
            order: { name: 'ASC' },
        });;
        
        return {
            data: users,
            total,
            page,
            lastPage: Math.ceil(total / perPage),
        };
    }
}