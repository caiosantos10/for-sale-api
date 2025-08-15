import ListPurchasesService from './ListPurchasesService';

// Mock do PurchaseRepository com um QueryBuilder encadeável
jest.mock('../repositories/PurchaseRepository', () => {
    const mock = {
        createQueryBuilder: jest.fn(),
    };
    return { ...mock, default: mock };
});

import PurchaseRepository from '../repositories/PurchaseRepository';

describe('ListPurchasesService', () => {
    const userId = 'user-1';

    // Helper para criar um "query builder" encadeável
    const makeQB = () => {
        const qb = {
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
        };
        return qb;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('lista compras paginadas com joins e mapeia para DTO (fluxo feliz)', async () => {
        const page = 2;
        const perPage = 3;
        const qb = makeQB();

        // Liga o createQueryBuilder ao mock encadeável
        (PurchaseRepository.createQueryBuilder as jest.Mock).mockReturnValue(qb);

        // Dados simulados retornados pelo getManyAndCount
        const purchases = [
            {
                id: 'pur-1',
                status: 'PENDING',
                delivery_address: 'Rua A,  10, Cidade, ST, 00000-000',
                purchaseProducts: [
                    {
                        product: {
                            id: 'prod-1',
                            name: 'Produto 1',
                            description: 'Desc 1',
                            price: 50,
                            image: 'img1.png',
                        },
                        quantity: 2,
                        observations: 'obs-1',
                    },
                ],
                paymentMethod: {
                    id: 'pm-1',
                    method: 'CARD',
                    installments: 3,
                    card_brand: 'VISA',
                },
            },
            {
                id: 'pur-2',
                status: 'PAID',
                delivery_address: 'Rua B,  20, Cidade, ST, 11111-111',
                purchaseProducts: [],
                paymentMethod: {
                    id: 'pm-2',
                    method: 'PIX',
                    installments: 1,
                    card_brand: null,
                },
            },
        ];
        const total = 8;

        qb.getManyAndCount.mockResolvedValueOnce([purchases, total]);

        const service = new ListPurchasesService();
        const result = await service.execute({ userId, page, perPage });

        // Verifica encadeamento e argumentos
        expect(PurchaseRepository.createQueryBuilder).toHaveBeenCalledWith('purchase');
        expect(qb.leftJoinAndSelect).toHaveBeenNthCalledWith(
            1,
            'purchase.purchaseProducts',
            'purchaseProduct'
        );
        expect(qb.leftJoinAndSelect).toHaveBeenNthCalledWith(
            2,
            'purchaseProduct.product',
            'product'
        );
        expect(qb.leftJoinAndSelect).toHaveBeenNthCalledWith(
            3,
            'purchase.paymentMethod',
            'paymentMethod'
        );
        expect(qb.where).toHaveBeenCalledWith('purchase.user_id = :userId', { userId });
        expect(qb.skip).toHaveBeenCalledWith((page - 1) * perPage); // (2-1)*3 = 3
        expect(qb.take).toHaveBeenCalledWith(perPage);

        // Verifica o mapeamento/DTO final
        expect(result).toEqual({
            data: [
                {
                    id: 'pur-1',
                    user_id: userId,
                    products: [
                        {
                            id: 'prod-1',
                            name: 'Produto 1',
                            description: 'Desc 1',
                            price: 50,
                            image: 'img1.png',
                            quantity: 2,
                            observations: 'obs-1',
                        },
                    ],
                    status: 'PENDING',
                    delivery_address: 'Rua A,  10, Cidade, ST, 00000-000',
                    payment_method: {
                        id: 'pm-1',
                        method: 'CARD',
                        installments: 3,
                        cardBrand: 'VISA',
                    },
                },
                {
                    id: 'pur-2',
                    user_id: userId,
                    products: [],
                    status: 'PAID',
                    delivery_address: 'Rua B,  20, Cidade, ST, 11111-111',
                    payment_method: {
                        id: 'pm-2',
                        method: 'PIX',
                        installments: 1,
                        cardBrand: null,
                    },
                },
            ],
            total,
            page,
            lastPage: Math.ceil(total / perPage), // 8/3 => 3
        });
    });

    it('retorna lista vazia quando não há compras', async () => {
        const page = 1;
        const perPage = 10;
        const qb = makeQB();
        (PurchaseRepository.createQueryBuilder as jest.Mock).mockReturnValue(qb);

        qb.getManyAndCount.mockResolvedValueOnce([[], 0]);

        const service = new ListPurchasesService();
        const result = await service.execute({ userId, page, perPage });

        expect(result).toEqual({
            data: [],
            total: 0,
            page: 1,
            lastPage: 0,
        });
        expect(qb.skip).toHaveBeenCalledWith(0);
        expect(qb.take).toHaveBeenCalledWith(10);
    });
});
