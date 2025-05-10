import AppError from "src/shared/errors/AppError";
import { PurchaseResponseDTO } from "../utils/purchase.dto";
import PurchaseRepository from "../repositories/PurchaseRepository";
import PurchaseProductsRepository from "../repositories/PurchaseProductsRepository";
import CartRepository from "@modules/cart/repositories/CartRepository";

interface IRequest {
    user_id: string;
}

export default class CreatePurchaseService {
    public async execute({ user_id }: IRequest): Promise<PurchaseResponseDTO> {
        const cartExists = await CartRepository.findByUser(user_id);
        if (!cartExists) {
            throw new AppError('Cart not found', 404);
        }
        
        const purchase = PurchaseRepository.create({ user_id });
        await PurchaseRepository.save(purchase);

        const cart = await CartRepository.findOne({
            where: { id: cartExists.id },
            relations: ['cartProducts', 'cartProducts.product']
        });


        // Create a PurchaseProducts for each Product 
        const purchaseProducts = cart!.cartProducts.map(cartProduct => ({
            product_id: cartProduct.product.id,
            purchase_id: purchase.id,
            quantity: cartProduct.quantity,
            observations: cartProduct.observations,
        }));

        await PurchaseProductsRepository.save(purchaseProducts);

        // Get the whole Purchase with Products attached
        const purchaseComplete = await PurchaseRepository.findOne({
            where: { id: purchase.id },
            relations: ['purchaseProducts', 'purchaseProducts.product'],
        });

        const purchaseResponse: PurchaseResponseDTO = {
            id: purchase.id,
            user_id: purchase.user_id,
            products: purchaseComplete?.purchaseProducts.map(purchaseProduct => ({
                id: purchaseProduct.product.id,
                name: purchaseProduct.product.name,
                description: purchaseProduct.product.name,
                price: purchaseProduct.product.price,
                image: purchaseProduct.product.image,
                quantity: purchaseProduct.quantity,
                observations: purchaseProduct.observations,
            })) ?? [],
            status: purchase.status
        };
        

        return purchaseResponse;

    }
}