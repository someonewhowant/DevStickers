export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description?: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id?: string;
  productId?: string;
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  stickerId: string;
  quantity: number;
  price: number;
  sticker: Product;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items: OrderItem[];
}
