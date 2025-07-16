const mockRepo = {
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
};
jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: () => ({
            extend: () => mockRepo
        }),
    },
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';

describe('UpdateProfileService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const fakeUser = {
        id: '1',
        name: 'User',
        email: 'user@email.com',
        password: 'old_hashed_pwd',
    };

    it('deve atualizar nome e email do usuário com sucesso', async () => {
        mockRepo.findOne.mockResolvedValue({ ...fakeUser });
        mockRepo.findByEmail.mockResolvedValue({ ...fakeUser });
        mockRepo.save.mockResolvedValue({ ...fakeUser, name: 'Novo', email: 'novo@email.com' });

        const service = new UpdateProfileService();

        const result = await service.execute({
            id: '1',
            name: 'Novo',
            email: 'novo@email.com',
            old_password: '',
            new_password: '',
        });

        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(mockRepo.findByEmail).toHaveBeenCalledWith('novo@email.com');
        expect(mockRepo.save).toHaveBeenCalled();
        expect(result.name).toBe('Novo');
        expect(result.email).toBe('novo@email.com');
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
        mockRepo.findOne.mockResolvedValue(null);

        const service = new UpdateProfileService();

        await expect(
            service.execute({
                id: '2',
                name: 'Novo',
                email: 'novo@email.com',
                old_password: '',
                new_password: '',
            })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
        expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro se email já estiver em uso por outro usuário', async () => {
        mockRepo.findOne.mockResolvedValue({ ...fakeUser });
        mockRepo.findByEmail.mockResolvedValue({ id: '2', name: 'Other', email: 'novo@email.com', password: 'hash' });

        const service = new UpdateProfileService();

        await expect(
            service.execute({
                id: '1',
                name: 'Novo',
                email: 'novo@email.com',
                old_password: '',
                new_password: '',
            })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockRepo.findByEmail).toHaveBeenCalledWith('novo@email.com');
        expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro se tentar trocar senha sem passar old_password', async () => {
        mockRepo.findOne.mockResolvedValue({ ...fakeUser });
        mockRepo.findByEmail.mockResolvedValue({ ...fakeUser });

        const service = new UpdateProfileService();

        await expect(
            service.execute({
                id: '1',
                name: 'User',
                email: 'user@email.com',
                old_password: '',
                new_password: 'novaSenha',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('deve lançar erro se old_password não bater', async () => {
        mockRepo.findOne.mockResolvedValue({ ...fakeUser });
        mockRepo.findByEmail.mockResolvedValue({ ...fakeUser });
        (compare as jest.Mock).mockResolvedValue(false);

        const service = new UpdateProfileService();

        await expect(
            service.execute({
                id: '1',
                name: 'User',
                email: 'user@email.com',
                old_password: 'senhaErrada',
                new_password: 'novaSenha',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('deve trocar a senha quando old_password estiver correto', async () => {
        mockRepo.findOne.mockResolvedValue({ ...fakeUser });
        mockRepo.findByEmail.mockResolvedValue({ ...fakeUser });
        (compare as jest.Mock).mockResolvedValue(true);
        (hash as jest.Mock).mockResolvedValue('new_hashed_pwd');
        mockRepo.save.mockResolvedValue({ ...fakeUser, password: 'new_hashed_pwd' });

        const service = new UpdateProfileService();

        const result = await service.execute({
            id: '1',
            name: 'User',
            email: 'user@email.com',
            old_password: 'correta',
            new_password: 'novaSenha',
        });

        expect(compare).toHaveBeenCalledWith('correta', fakeUser.password);
        expect(hash).toHaveBeenCalledWith('novaSenha', 8);
        expect(mockRepo.save).toHaveBeenCalled();
        expect(result.password).toBe('new_hashed_pwd');
    });
});
