import CreateCartService from './CreateCartService';
import AppError from '@shared/errors/AppError';

// --------------- Mocks inline ---------------
jest.mock('typeorm', () => ({ In: (ids: any) => ids }));

// Repositórios usados pelo service
jest.mock('../repositories/CartRepository', () => {
    const mock = {
        findOne: jest.fn(),
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

jest.mock('../repositories/CartProductsRepository', () => {
    const mock = {
        create: jest.fn(),
        save: jest.fn(),
    };
    return { ...mock, default: mock };
});

// Mock UpdateCartService
const updateExecuteMock = jest.fn();
jest.mock('./UpdateCartService', () => {
    return jest.fn().mockImplementation(() => ({
        execute: updateExecuteMock,
    }));
});

// --------------- Imports dos mocks ---------------
import CartRepository from '../repositories/CartRepository';
import ProductRepository from '@modules/products/repositories/ProductRepository';
import CartProductsRepository from '../repositories/CartProductsRepository';
import UpdateCartService from './UpdateCartService';

describe('CreateCartService', () => {
    const user_id = 'user-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lança AppError se products estiver vazio', async () => {
        const service = new CreateCartService();

        await expect(
            service.execute({ user_id, products: [] })
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            service.execute({ user_id, products: [] })
        ).rejects.toHaveProperty('message', 'You must pass one or more products to create a Cart.');
    });

    it('quando o carrinho já existe, delega para UpdateCartService.execute e retorna o resultado', async () => {
        // arrange
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce({ id: 'cart-abc', user_id });
        const expectedResponse = {
            id: 'cart-abc',
            user_id,
            products: [
                { id: 'p1', name: 'A', description: 'A', price: 10, image: 'a.png', quantity: 2, observations: 'obs' },
            ],
        };
        updateExecuteMock.mockResolvedValueOnce(expectedResponse);

        const service = new CreateCartService();
        const input = {
            user_id,
            products: [{ id: 'p1', quantity: 2, observations: 'obs' }],
        };

        // act
        const result = await service.execute(input);

        // assert
        expect(UpdateCartService).toHaveBeenCalledTimes(1);
        expect(updateExecuteMock).toHaveBeenCalledWith({ cart_id: 'cart-abc', products: input.products });
        expect(result).toEqual(expectedResponse);
    });

    it('cria novo cart e lança erro se algum produto não for encontrado', async () => {
        // Não existe cart
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

        // create/save do cart
        (CartRepository.create as jest.Mock).mockImplementation((data: any) => ({ id: 'new-cart', ...data }));
        (CartRepository.save as jest.Mock).mockImplementation(async (c: any) => c);

        // encontrados só 1 dos 2 -> força erro
        (ProductRepository.findBy as jest.Mock).mockResolvedValue([
            { id: 'p1', name: 'A', description: 'A', price: 10, image: 'a.png' },
        ]);

        const service = new CreateCartService();
        const input = {
            user_id,
            products: [
                { id: 'p1', quantity: 1, observations: 'x' },
                { id: 'p2', quantity: 1, observations: 'y' },
            ],
        };

        expect.assertions(2);
        try {
            await service.execute(input); // apenas UMA chamada
        } catch (err: any) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('One or more products not found');
        }
    });
      

    it('cria novo cart com sucesso, salva itens e retorna DTO completo', async () => {
        // Não existe cart inicialmente
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

        // create/save do cart
        (CartRepository.create as jest.Mock).mockImplementation((data: any) => ({ id: 'new-cart', ...data }));
        (CartRepository.save as jest.Mock).mockImplementation(async (c: any) => c);

        // Produtos encontrados (mesmo número que enviados)
        (ProductRepository.findBy as jest.Mock).mockResolvedValueOnce([
            { id: 'p1', name: 'Produto 1', description: 'Desc 1', price: 10, image: 'img1.png' },
            { id: 'p2', name: 'Produto 2', description: 'Desc 2', price: 20, image: 'img2.png' },
        ]);

        // create/save dos cartProducts
        (CartProductsRepository.create as jest.Mock).mockImplementation((data: any) => ({ id: 'cp-' + data.product_id, ...data }));
        (CartProductsRepository.save as jest.Mock).mockResolvedValueOnce(undefined);

        // Buscar cart completo com relations
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce({
            id: 'new-cart',
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

        const service = new CreateCartService();
        const input = {
            user_id,
            products: [
                { id: 'p1', quantity: 2, observations: 'sem cebola' },
                { id: 'p2', quantity: 1, observations: 'pouco sal' },
            ],
        };

        const result = await service.execute(input);

        // Asserts principais
        expect(CartRepository.create).toHaveBeenCalledWith({ user_id });
        expect(CartRepository.save).toHaveBeenCalledWith({ id: 'new-cart', user_id });
        expect(ProductRepository.findBy).toHaveBeenCalled();
        expect(CartProductsRepository.create).toHaveBeenCalledTimes(2);
        expect(CartProductsRepository.save).toHaveBeenCalledTimes(1);
        expect(CartRepository.findOne).toHaveBeenCalledWith({
            where: { id: 'new-cart' },
            relations: ['cartProducts', 'cartProducts.product'],
        });

        // DTO final
        expect(result).toEqual({
            id: 'new-cart',
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
