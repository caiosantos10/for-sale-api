import { PageList } from "@shared/interfaces/page-list.interface";
import User from "../entities/Users";
import UsersRepository from "../repositories/UsersRepository";

interface IRequest {
    page: number;
    perPage: number;
}

export default class ListUsersService {
    public async execute({ page, perPage }: IRequest): Promise<PageList<User>> {
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