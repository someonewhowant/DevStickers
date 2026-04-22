import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private STORAGE_KEY = 'sticker_cart';
  
  private cartItems = signal<CartItem[]>(this.loadCart());

  // Total count of items (sum of quantities)
  cartCount = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  // Total price
  subtotal = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  private loadCart(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveCart(items: CartItem[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }

  addToCart(product: Product) {
    this.cartItems.update(items => {
      const existingItem = items.find(i => i.product.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = items.map(i => 
          i.product.id === product.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      } else {
        newItems = [...items, { product, quantity: 1 }];
      }
      this.saveCart(newItems);
      return newItems;
    });
  }

  updateQuantity(productId: string, delta: number) {
    this.cartItems.update(items => {
      const newItems = items.map(item => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      this.saveCart(newItems);
      return newItems;
    });
  }

  getCartItems() {
    return this.cartItems();
  }

  removeFromCart(productId: string) {
    this.cartItems.update(items => {
      const newItems = items.filter(item => item.product.id !== productId);
      this.saveCart(newItems);
      return newItems;
    });
  }

  clearCart() {
    this.cartItems.set([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
