import AppError from "src/shared/errors/AppError";
import UsersRepository from "../repositories/UsersRepository";
import User from "../entities/Users";
import { hash } from "bcryptjs";
import { UpdateUserDTO } from "../utils/users.dto";
import AddressRepository from "../repositories/AddressRepository";

export default class UpdateUserService {
    public async execute({
        id,
        name,
        lastName,
        email,
        password,
        role,
        addresses
    }: UpdateUserDTO): Promise<User> {
        const user = await UsersRepository.findOne({ where: { id } });

        if (!user) throw new AppError('User not found.');

        user.name = name;
        user.lastName = lastName;
        user.email = email;
        user.password = await hash(password, 8);
        user.role = role;

        const addressesToAdd = await AddressRepository.create(addresses.map(address => ({
            ...address, user_id: id
        })));
        await AddressRepository.save(addressesToAdd);

        user.addresses = addressesToAdd;

        await UsersRepository.save(user);

        return user;
    }
}