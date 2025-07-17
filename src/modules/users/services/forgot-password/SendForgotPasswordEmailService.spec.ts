// ---- MOCKS DE REPOSITÓRIOS E MAIL ----
const mockUserRepo = { findByEmail: jest.fn() };
const mockUserTokensRepo = { generate: jest.fn() };

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

jest.mock('@config/mail/EtherealMail.config', () => ({
    EtherealMail: {
        sendEmail: jest.fn(),
    },
}));

// --- MOCK "path" repassando tudo, só resolve customizado ---
jest.mock('path', () => {
    const actualPath = jest.requireActual('path');
    return {
        ...actualPath,
        resolve: () => '/fake/template/path',
    };
});

// ---- IMPORTS DO SERVICE ----
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import { EtherealMail } from '@config/mail/EtherealMail.config';

describe('SendForgotPasswordEmailService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const fakeUser = {
        id: '1',
        name: 'User',
        email: 'user@email.com',
    };

    it('deve enviar email de recuperação se usuário existir', async () => {
        mockUserRepo.findByEmail.mockResolvedValue(fakeUser);
        mockUserTokensRepo.generate.mockResolvedValue({ token: 'token123' });

        const service = new SendForgotPasswordEmailService();

        await expect(
            service.execute({ email: 'user@email.com' })
        ).resolves.toBeUndefined();

        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('user@email.com');
        expect(mockUserTokensRepo.generate).toHaveBeenCalledWith('1');
        expect(EtherealMail.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
            to: {
                name: 'User',
                email: 'user@email.com',
            },
            subject: expect.stringContaining('Recuperação'),
            templateData: expect.objectContaining({
                variables: expect.objectContaining({
                    name: 'User',
                    link: expect.stringContaining('token123'),
                }),
            }),
        }));
    });

    it('deve lançar erro se o usuário não existir', async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        const service = new SendForgotPasswordEmailService();

        await expect(
            service.execute({ email: 'naoexiste@email.com' })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockUserTokensRepo.generate).not.toHaveBeenCalled();
        expect(EtherealMail.sendEmail).not.toHaveBeenCalled();
    });
});
