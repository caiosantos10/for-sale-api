import DeleteCartService from './DeleteCartService';
import AppError from '@shared/errors/AppError';

jest.mock('../repositories/CartRepository', () => {
    const mock = {
        findOne: jest.fn(),
        remove: jest.fn(),
    };
    return { ...mock, default: mock };
});

import CartRepository from '../repositories/CartRepository';

describe('DeleteCartService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('remove o carrinho quando existe (fluxo feliz)', async () => {
        const cart = { id: 'cart-1', user_id: 'user-1' };
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce(cart);
        (CartRepository.remove as jest.Mock).mockResolvedValueOnce(undefined);

        const service = new DeleteCartService();
        await service.execute({ id: 'cart-1' });

        expect(CartRepository.findOne).toHaveBeenCalledWith({ where: { id: 'cart-1' } });
        expect(CartRepository.remove).toHaveBeenCalledWith(cart);
    });

    it('lança AppError quando o carrinho não existe', async () => {
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

        const service = new DeleteCartService();

        expect.assertions(3);
        try {
            await service.execute({ id: 'missing' });
        } catch (err: any) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('Cart not found.');
            expect(CartRepository.remove).not.toHaveBeenCalled();
        }
    });
});
