// Mocks
const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
};
const mockAddressRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
};

jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: (entity: any) => ({
            extend: () => {
                // Retorna o mock correto baseado na entidade
                if (entity?.name === 'Users' || entity?.name === 'User') return mockUserRepo;
                if (entity?.name === 'Address' || entity?.name === 'Addresses') return mockAddressRepo;
                return {};
            }
        }),
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

import UpdateUserService from './UpdateUserService';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import RoleEnum from '../shared/enums/Role.enum';

describe('UpdateUserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const fakeAddress = {
        id: 'address1',
        street: 'Rua 1',
        number: '10',
        city: 'Cidade',
        state: 'Estado',
        zip_code: '123456-000',
    };

    const fakeUser = {
        id: 'user1',
        name: 'Antigo',
        lastName: 'Usuario',
        email: 'antigo@email.com',
        password: 'old_hash',
        role: RoleEnum.Admin,
        addresses: [fakeAddress]
    };

    it('deve atualizar usuário e retornar user completo', async () => {
        mockUserRepo.findOne
            .mockResolvedValueOnce({ ...fakeUser }) // user existente
            .mockResolvedValueOnce({ // user completo após atualização
                ...fakeUser,
                name: 'Novo',
                lastName: 'NovoSobrenome',
                email: 'novo@email.com',
                password: 'nova_hash',
                addresses: [fakeAddress]
            });
        (hash as jest.Mock).mockResolvedValue('nova_hash');
        mockAddressRepo.create.mockResolvedValue([fakeAddress]);
        mockAddressRepo.save.mockResolvedValue([fakeAddress]);
        mockUserRepo.save.mockResolvedValue({});

        const service = new UpdateUserService();

        const result = await service.execute({
            id: 'user1',
            name: 'Novo',
            lastName: 'NovoSobrenome',
            email: 'novo@email.com',
            password: 'novaSenha',
            role: RoleEnum.Admin,
            addresses: [fakeAddress],
        });

        expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user1' } });
        expect(hash).toHaveBeenCalledWith('novaSenha', 8);
        expect(mockAddressRepo.create).toHaveBeenCalled();
        expect(mockAddressRepo.save).toHaveBeenCalled();
        expect(mockUserRepo.save).toHaveBeenCalled();
        expect(result).toHaveProperty('id', 'user1');
        expect(result).toHaveProperty('name', 'Novo');
        expect(result).toHaveProperty('addresses');
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
        mockUserRepo.findOne.mockResolvedValueOnce(null);

        const service = new UpdateUserService();

        await expect(service.execute({
            id: 'userNotExist',
            name: 'Name',
            lastName: 'Last',
            email: 'no@email.com',
            password: 'pwd',
            role: RoleEnum.Customer,
            addresses: [],
        })).rejects.toBeInstanceOf(AppError);

        expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 'userNotExist' } });
        expect(hash).not.toHaveBeenCalled();
    });

    it('deve remover todos os endereços se addresses for array vazio', async () => {
        mockUserRepo.findOne
            .mockResolvedValueOnce({ ...fakeUser })
            .mockResolvedValueOnce({ ...fakeUser }); // Para o findOne do final
        (hash as jest.Mock).mockResolvedValue('nova_hash');
        mockAddressRepo.create.mockResolvedValue([]);
        mockAddressRepo.save.mockResolvedValue([]);
        mockAddressRepo.find.mockResolvedValue([fakeAddress]);
        mockAddressRepo.remove.mockResolvedValue(undefined);
        mockUserRepo.save.mockResolvedValue({});
        mockUserRepo.findOne.mockResolvedValueOnce({
            ...fakeUser,
            addresses: []
        });

        const service = new UpdateUserService();

        await service.execute({
            id: 'user1',
            name: 'Novo',
            lastName: 'NovoSobrenome',
            email: 'novo@email.com',
            password: 'novaSenha',
            role: RoleEnum.Customer,
            addresses: [],
        });

        expect(mockAddressRepo.find).toHaveBeenCalledWith({ where: { user: { id: 'user1' } } });
        expect(mockAddressRepo.remove).toHaveBeenCalled();
    });
});
