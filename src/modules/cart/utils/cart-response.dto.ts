interface ProductDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export interface CartResponseDTO {
    id: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
    products: ProductDTO[];
}
