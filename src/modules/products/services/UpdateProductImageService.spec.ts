// Mock do ProductRepository
const mockProductRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
};

jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: (entity: any) => ({
            extend: () => mockProductRepo
        }),
    },
}));

jest.mock('@config/upload', () => ({
    directory: '/tmp/uploads'
}));

// Mocka helper do fs
jest.mock('@shared/utils/file-utils', () => ({
    fileExists: jest.fn(),
    removeFile: jest.fn(),
}));

import UpdateProductImageService from './UpdateProductImageService';
import AppError from '@shared/errors/AppError';
import { fileExists, removeFile } from '@shared/utils/file-utils';

describe('UpdateProductImageService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve lançar erro se produto não for encontrado', async () => {
        mockProductRepo.findOne.mockResolvedValue(null);

        const service = new UpdateProductImageService();

        await expect(
            service.execute({ productId: 'notfound', imageFileName: 'foto.png' })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: 'notfound' } });
    });

    it('deve atualizar imagem quando não existe imagem anterior', async () => {
        const fakeProduct = { id: '1', name: 'Produto', image: undefined };
        mockProductRepo.findOne.mockResolvedValue({ ...fakeProduct });
        mockProductRepo.save.mockResolvedValue({ ...fakeProduct, image: 'foto.png' });
        (fileExists as jest.Mock).mockResolvedValue(false);

        const service = new UpdateProductImageService();

        const result = await service.execute({ productId: '1', imageFileName: 'foto.png' });

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(mockProductRepo.save).toHaveBeenCalledWith({ ...fakeProduct, image: 'foto.png' });
        expect(result).toEqual({ ...fakeProduct, image: 'foto.png' });
        expect(fileExists).not.toHaveBeenCalledWith(expect.any(String)); // image undefined
        expect(removeFile).not.toHaveBeenCalled();
    });

    it('deve apagar imagem antiga e atualizar nova imagem', async () => {
        const fakeProduct = { id: '2', name: 'Produto', image: 'existing.png' };
        mockProductRepo.findOne.mockResolvedValue({ ...fakeProduct });
        mockProductRepo.save.mockResolvedValue({ ...fakeProduct, image: 'nova.png' });
        (fileExists as jest.Mock).mockResolvedValue(true);

        const service = new UpdateProductImageService();

        const result = await service.execute({ productId: '2', imageFileName: 'nova.png' });

        expect(fileExists).toHaveBeenCalledWith(expect.stringContaining('existing.png'));
        expect(removeFile).toHaveBeenCalledWith(expect.stringContaining('existing.png'));
        expect(mockProductRepo.save).toHaveBeenCalledWith({ ...fakeProduct, image: 'nova.png' });
        expect(result).toEqual({ ...fakeProduct, image: 'nova.png' });
    });

    it('não deve tentar apagar imagem se stat lançar erro (arquivo não existe)', async () => {
        const fakeProduct = { id: '3', name: 'Produto', image: 'naoexiste.png' };
        mockProductRepo.findOne.mockResolvedValue({ ...fakeProduct });
        mockProductRepo.save.mockResolvedValue({ ...fakeProduct, image: 'foto.png' });
        (fileExists as jest.Mock).mockResolvedValue(false);

        const service = new UpdateProductImageService();

        const result = await service.execute({ productId: '3', imageFileName: 'foto.png' });

        expect(fileExists).toHaveBeenCalledWith(expect.stringContaining('naoexiste.png'));
        expect(removeFile).not.toHaveBeenCalled();
        expect(mockProductRepo.save).toHaveBeenCalledWith({ ...fakeProduct, image: 'foto.png' });
        expect(result).toEqual({ ...fakeProduct, image: 'foto.png' });
    });
});
