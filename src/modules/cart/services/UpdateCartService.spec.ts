import UpdateCartService from './UpdateCartService';
import { ICartRepository, ICartProductsRepository, IProductRepository } from '@shared/interfaces/repositories.interface';

describe('UpdateCartService', () => {
    const cartRepositoryMock: ICartRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
    } as any;

    const cartProductsRepositoryMock: ICartProductsRepository = {
        findBy: jest.fn(),
        remove: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    } as any;

    const productRepositoryMock: IProductRepository = {
        findBy: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar um carrinho existente', async () => {
        const service = new UpdateCartService(cartRepositoryMock, cartProductsRepositoryMock, productRepositoryMock);

        (cartRepositoryMock.findOne as jest.Mock)
            .mockResolvedValueOnce({ id: 'cart-1', user_id: 'user-1' }) // cart existente
            .mockResolvedValueOnce({                                  // cart completo com produtos
                id: 'cart-1',
                user_id: 'user-1',
                cartProducts: [
                    {
                        product: { id: 'prod-1', name: 'P1', price: 5, image: 'img' },
                        quantity: 1,
                        observations: 'obs',
                    },
                ],
            });

        (cartProductsRepositoryMock.findBy as jest.Mock).mockResolvedValue([{ id: 'cp-1' }]);
        (cartProductsRepositoryMock.remove as jest.Mock).mockResolvedValue(undefined);
        (productRepositoryMock.findBy as jest.Mock).mockResolvedValue([
            { id: 'prod-1', name: 'P1', price: 5, image: 'img' },
        ]);
        (cartProductsRepositoryMock.create as jest.Mock).mockReturnValue([{ id: 'cp-2' }]);
        (cartProductsRepositoryMock.save as jest.Mock).mockResolvedValue(undefined);
        (cartRepositoryMock.save as jest.Mock).mockResolvedValue(undefined);

        const result = await service.execute({
            cart_id: 'cart-1',
            products: [{ id: 'prod-1', quantity: 1, observations: 'obs' }],
        });

        expect(result.products).toHaveLength(1);
        expect(result.products[0].name).toBe('P1');
    });

    it('deve lançar erro se carrinho não existir', async () => {
        (cartRepositoryMock.findOne as jest.Mock).mockResolvedValue(undefined);

        const service = new UpdateCartService(cartRepositoryMock, cartProductsRepositoryMock, productRepositoryMock);

        await expect(
            service.execute({ cart_id: 'invalid', products: [] }),
        ).rejects.toThrow('Cart not found.');
    });
});
