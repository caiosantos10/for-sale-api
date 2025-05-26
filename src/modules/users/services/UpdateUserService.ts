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
    }: UpdateUserDTO): Promise<UpdateUserDTO> {
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

        // If addresses is an empty array, remove all addresses linked to the user
        if (addressesToAdd.length === 0) {
            const addressToExclude = await AddressRepository.find({
                where: { user: { id } }
            });
            await AddressRepository.remove(addressToExclude!);
        }

        await UsersRepository.save(user);

        const userComplete = await UsersRepository.findOne({
            where: { id },
            relations: ['addresses'],
        });

        const userResponse = {
            id: userComplete!.id,
            name: userComplete!.name,
            lastName: userComplete!.lastName,
            email: userComplete!.email,
            password: userComplete!.password,
            role: userComplete!.role,
            addresses: userComplete!.addresses.map(address => ({
                id: address.id,
                street: address.street,
                number: address.number,
                city: address.city,
                state: address.state,
                zip_code: address.zip_code,
            })),
        };

        return userResponse;
    }
}