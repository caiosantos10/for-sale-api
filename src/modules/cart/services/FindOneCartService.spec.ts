import FindOneCartService from './FindOneCartService';
import AppError from '@shared/errors/AppError';

jest.mock('../repositories/CartRepository', () => {
    const mock = {
        findOne: jest.fn(),
    };
    return { ...mock, default: mock };
});

import CartRepository from '../repositories/CartRepository';

describe('FindOneCartService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna o cart com produtos (fluxo feliz)', async () => {
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce({
            id: 'cart-1',
            user_id: 'user-1',
            cartProducts: [
                {
                    product: { id: 'p1', name: 'Produto 1', price: 10, image: 'img1.png' },
                    quantity: 2,
                    observations: 'sem cebola',
                },
                {
                    product: { id: 'p2', name: 'Produto 2', price: 20, image: 'img2.png' },
                    quantity: 1,
                    observations: 'pouco sal',
                },
            ],
        });

        const service = new FindOneCartService();
        const result = await service.execute({ id: 'cart-1' });

        expect(CartRepository.findOne).toHaveBeenCalledWith({
            where: { id: 'cart-1' },
            relations: ['cartProducts', 'cartProducts.product'],
        });

        expect(result).toEqual({
            id: 'cart-1',
            user_id: 'user-1',
            products: [
                {
                    id: 'p1',
                    name: 'Produto 1',
                    description: 'Produto 1',
                    price: 10,
                    image: 'img1.png',
                    quantity: 2,
                    observations: 'sem cebola',
                },
                {
                    id: 'p2',
                    name: 'Produto 2',
                    description: 'Produto 2',
                    price: 20,
                    image: 'img2.png',
                    quantity: 1,
                    observations: 'pouco sal',
                },
            ],
        });
    });

    it('lança AppError quando o cart não é encontrado', async () => {
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

        const service = new FindOneCartService();

        expect.assertions(2);
        try {
            await service.execute({ id: 'missing' });
        } catch (err: any) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('Cart not found.');
        }
    });
});
