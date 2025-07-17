// Mock dos repositórios e do TypeORM
const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
};
const mockUserTokensRepo = {
    findByToken: jest.fn(),
};

jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: (entity: any) => ({
            extend: () => {
                if (entity?.name === 'Users' || entity?.name === 'User') return mockUserRepo;
                if (entity?.name?.includes('Token')) return mockUserTokensRepo;
                return {};
            }
        }),
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

jest.mock('date-fns', () => ({
    addHours: jest.fn(),
    isAfter: jest.fn(),
}));

import ResetPasswordService from './ResetPasswordService';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { addHours, isAfter } from 'date-fns';

describe('ResetPasswordService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const fakeUser = {
        id: '1',
        password: 'old_hash',
    };
    const fakeToken = {
        token: 'validtoken',
        user_id: '1',
        created_at: new Date('2023-01-01T12:00:00'),
    };

    it('deve resetar a senha com token válido', async () => {
        mockUserTokensRepo.findByToken.mockResolvedValue(fakeToken);
        mockUserRepo.findOne.mockResolvedValue(fakeUser);
        (addHours as jest.Mock).mockReturnValue(new Date('2023-01-01T14:00:00'));
        (isAfter as jest.Mock).mockReturnValue(false);
        (hash as jest.Mock).mockResolvedValue('hashed_new_pwd');
        mockUserRepo.save.mockResolvedValue(undefined);

        const service = new ResetPasswordService();

        await expect(service.execute({ token: 'validtoken', password: 'novaSenha' }))
            .resolves.toBeUndefined();

        expect(mockUserTokensRepo.findByToken).toHaveBeenCalledWith('validtoken');
        expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(hash).toHaveBeenCalledWith('novaSenha', 8);
        expect(mockUserRepo.save).toHaveBeenCalledWith({ ...fakeUser, password: 'hashed_new_pwd' });
    });

    it('deve lançar erro se token não existir', async () => {
        mockUserTokensRepo.findByToken.mockResolvedValue(null);

        const service = new ResetPasswordService();

        await expect(service.execute({ token: 'invalidtoken', password: '123' }))
            .rejects.toBeInstanceOf(AppError);

        expect(mockUserRepo.findOne).not.toHaveBeenCalled();
        expect(hash).not.toHaveBeenCalled();
        expect(mockUserRepo.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro se usuário não existir', async () => {
        mockUserTokensRepo.findByToken.mockResolvedValue(fakeToken);
        mockUserRepo.findOne.mockResolvedValue(null);

        const service = new ResetPasswordService();

        await expect(service.execute({ token: 'validtoken', password: '123' }))
            .rejects.toBeInstanceOf(AppError);

        expect(hash).not.toHaveBeenCalled();
        expect(mockUserRepo.save).not.toHaveBeenCalled();
    });

    it('deve lançar erro se o token estiver expirado', async () => {
        mockUserTokensRepo.findByToken.mockResolvedValue(fakeToken);
        mockUserRepo.findOne.mockResolvedValue(fakeUser);
        (addHours as jest.Mock).mockReturnValue(new Date('2023-01-01T14:00:00'));
        (isAfter as jest.Mock).mockReturnValue(true);

        const service = new ResetPasswordService();

        await expect(service.execute({ token: 'validtoken', password: 'nova' }))
            .rejects.toBeInstanceOf(AppError);

        expect(hash).not.toHaveBeenCalled();
        expect(mockUserRepo.save).not.toHaveBeenCalled();
    });
});
