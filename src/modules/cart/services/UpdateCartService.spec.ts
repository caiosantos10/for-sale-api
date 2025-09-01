import UpdateCartService from './UpdateCartService';
import AppError from '@shared/errors/AppError';

jest.mock('typeorm', () => ({ In: (ids: any) => ids }));

jest.mock('../repositories/CartRepository', () => {
    const mock = {
        findOne: jest.fn(),
        save: jest.fn(),
    };
    return { ...mock, default: mock };
});

jest.mock('../repositories/CartProductsRepository', () => {
    const mock = {
        findBy: jest.fn(),
        remove: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };
    return { ...mock, default: mock };
});

jest.mock('@modules/products/repositories/ProductRepository', () => {
    const mock = {
        findBy: jest.fn(),
    };
    return { ...mock, default: mock };
});

import CartRepository from '../repositories/CartRepository';
import CartProductsRepository from '../repositories/CartProductsRepository';
import ProductRepository from '@modules/products/repositories/ProductRepository';

describe('UpdateCartService', () => {
    const cart_id = 'cart-1';
    const user_id = 'user-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lança AppError quando o cart não é encontrado', async () => {
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

        const service = new UpdateCartService();

        expect.assertions(2);
        try {
            await service.execute({
                cart_id,
                products: [{ id: 'p1', quantity: 1 }],
            });
        } catch (err: any) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('Cart not found.');
        }
    });

    it('lança Error quando um ou mais produtos não são encontrados', async () => {
        // 1ª consulta: encontra o cart
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce({ id: cart_id, user_id });

        // remove itens antigos
        (CartProductsRepository.findBy as jest.Mock).mockResolvedValueOnce([{ id: 'old-1' }]);
        (CartProductsRepository.remove as jest.Mock).mockResolvedValueOnce(undefined);

        // findBy retorna só 1 de 2 produtos -> força erro
        (ProductRepository.findBy as jest.Mock).mockResolvedValueOnce([
            { id: 'p1', name: 'A', description: 'A', price: 10, image: 'a.png' },
        ]);

        const service = new UpdateCartService();

        const input = {
            cart_id,
            products: [
                { id: 'p1', quantity: 1, observations: 'x' },
                { id: 'p2', quantity: 1, observations: 'y' },
            ],
        };

        expect.assertions(2);
        try {
            await service.execute(input);
        } catch (err: any) {
            // aqui é Error genérico, não AppError (o service lança Error)
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('One or more products not found');
        }
    });

    it('atualiza o cart com sucesso: remove antigos, adiciona novos e retorna DTO', async () => {
        // 1) encontra o cart
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce({ id: cart_id, user_id });

        // 2) limpa itens antigos
        (CartProductsRepository.findBy as jest.Mock).mockResolvedValueOnce([{ id: 'old-1' }, { id: 'old-2' }]);
        (CartProductsRepository.remove as jest.Mock).mockResolvedValueOnce(undefined);

        // 3) produtos encontrados (mesmo número que enviados)
        (ProductRepository.findBy as jest.Mock).mockResolvedValueOnce([
            { id: 'p1', name: 'Produto 1', description: 'Desc 1', price: 10, image: 'img1.png' },
            { id: 'p2', name: 'Produto 2', description: 'Desc 2', price: 20, image: 'img2.png' },
        ]);

        // 4) criar/salvar novos itens
        (CartProductsRepository.create as jest.Mock).mockImplementation((data: any) => ({ id: `cp-${data.product_id}`, ...data }));
        (CartProductsRepository.save as jest.Mock).mockResolvedValueOnce(undefined);

        // 5) salvar o cart (sem mudanças de campos, apenas para cobrir chamada)
        (CartRepository.save as jest.Mock).mockResolvedValueOnce(undefined);

        // 6) busca o cart completo com relations
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce({
            id: cart_id,
            user_id,
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

        const service = new UpdateCartService();
        const input = {
            cart_id,
            products: [
                { id: 'p1', quantity: 2, observations: 'sem cebola' },
                { id: 'p2', quantity: 1, observations: 'pouco sal' },
            ],
        };

        const result = await service.execute(input);

        // Verifica chamadas principais
        expect(CartRepository.findOne).toHaveBeenNthCalledWith(1, { where: { id: cart_id } });
        expect(CartProductsRepository.findBy).toHaveBeenCalledWith({ cart_id });
        expect(CartProductsRepository.remove).toHaveBeenCalledWith([{ id: 'old-1' }, { id: 'old-2' }]);
        expect(ProductRepository.findBy).toHaveBeenCalledWith({ id: ['p1', 'p2'] }); // pois In(...) retorna o array
        expect(CartProductsRepository.create).toHaveBeenCalledTimes(2);
        expect(CartProductsRepository.save).toHaveBeenCalledTimes(1);
        expect(CartRepository.save).toHaveBeenCalledWith({ id: cart_id, user_id });
        expect(CartRepository.findOne).toHaveBeenNthCalledWith(2, {
            where: { id: cart_id },
            relations: ['cartProducts', 'cartProducts.product'],
        });

        // DTO final
        expect(result).toEqual({
            id: cart_id,
            user_id,
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
});
