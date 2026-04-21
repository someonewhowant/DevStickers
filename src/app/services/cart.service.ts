import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<Product[]>([]);

  cartCount = computed(() => this.cartItems().length);

  addToCart(product: Product) {
    this.cartItems.update(items => [...items, product]);
  }

  getCartItems() {
    return this.cartItems();
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
