import { Injectable, signal } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Product[]>([]);

  cartCount = signal(0);

  addToCart(product: Product) {
    this.cartItems.update(items => [...items, product]);
    this.cartCount.update(count => count + 1);
  }

  getCartItems() {
    return this.cartItems();
  }
}
