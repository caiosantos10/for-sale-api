import DeleteCartService from './DeleteCartService';
import { ICartRepository } from '@shared/interfaces/repositories.interface';

describe('DeleteCartService', () => {
    it('deve deletar o carrinho se ele existir', async () => {
        const cartRepoMock: ICartRepository = {
            findOne: jest.fn().mockResolvedValue({ id: '123' }),
            remove: jest.fn().mockResolvedValue(undefined),
            save: jest.fn(),
            create: jest.fn(),
        };

        const service = new DeleteCartService(cartRepoMock);

        await expect(service.execute({ id: '123' })).resolves.not.toThrow();

        expect(cartRepoMock.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
        expect(cartRepoMock.remove).toHaveBeenCalledWith({ id: '123' });
    });

    it('deve lançar erro se o carrinho não for encontrado', async () => {
        const cartRepoMock: ICartRepository = {
            findOne: jest.fn().mockResolvedValue(undefined),
            remove: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
        };

        const service = new DeleteCartService(cartRepoMock);

        const fakeId = '00000000-0000-0000-0000-000000000000';

        await expect(service.execute({ id: fakeId }))
            .rejects
            .toThrow('Cart not found.');
    });
});
