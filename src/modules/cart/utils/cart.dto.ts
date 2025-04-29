interface ProductResponseDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    observations: string;
}

export interface CartResponseDTO {
    id: string;
    user_id: string;
    products: ProductResponseDTO[];
}

export interface ProductsRequestDTO {
    id: string;
    quantity?: number;
    observations?: string;
}
