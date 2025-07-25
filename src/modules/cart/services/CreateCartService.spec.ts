import CreateCartService from './CreateCartService';
import { ICartRepository, IProductRepository, ICartProductsRepository } from '@shared/interfaces/repositories.interface';
import UpdateCartService from './UpdateCartService';

// Mocks manuais com interfaces
const cartRepoMock: ICartRepository = {
    findOne: jest.fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({
            id: 'cart-id',
            user_id: 'user-id',
            cartProducts: [
                {
                    product: { id: '1', name: 'Produto 1', price: 10, image: 'img.png' },
                    quantity: 2,
                    observations: 'sem cebola'
                }
            ]
        }),
    create: jest.fn().mockReturnValue({ id: 'cart-id', user_id: 'user-id' }),
    save: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn()
};

const productRepoMock: IProductRepository = {
    findBy: jest.fn().mockResolvedValue([
        { id: '1', name: 'Produto 1', price: 10, image: 'img.png' },
    ]),
};

const cartProductsRepoMock: ICartProductsRepository = {
    create: jest.fn().mockReturnValue([
        {
            id: 'cart-product-id',
            cart_id: 'cart-id',
            product_id: '1',
            quantity: 2,
            observations: 'sem cebola',
        }
    ]),
    save: jest.fn().mockResolvedValue(undefined),
    findBy: jest.fn(),
    remove: jest.fn()
};

const updateCartMock: UpdateCartService = {
    execute: jest.fn(),
} as unknown as UpdateCartService;

describe('CreateCartService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar um novo carrinho se não existir um para o usuário', async () => {
        const service = new CreateCartService(
            cartRepoMock,
            productRepoMock,
            cartProductsRepoMock,
            updateCartMock
        );

        const result = await service.execute({
            user_id: 'user-id',
            products: [{ id: '1', quantity: 2, observations: 'sem cebola' }],
        });

        expect(result).toHaveProperty('id', 'cart-id');
        expect(result.products).toHaveLength(1);
        expect(result.products[0]).toMatchObject({
            id: '1',
            name: 'Produto 1',
            price: 10,
            quantity: 2,
            observations: 'sem cebola',
            image: 'img.png',
        });
    });
});
