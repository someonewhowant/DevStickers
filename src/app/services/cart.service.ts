import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, CartItem } from '../models/product.model';
import { catchError, retry, tap, switchMap } from 'rxjs/operators';
import { of, forkJoin, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/cart';
  private readonly STORAGE_KEY = 'sticker_cart_cache';
  
  private cartItems = signal<CartItem[]>(this.loadFromStorage());

  cartCount = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  subtotal = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  constructor() {
    this.syncWithServer();
  }

  private syncWithServer() {
    this.http.get<any[]>(this.API_URL).pipe(
      retry(1),
      tap(items => {
        const mappedItems: CartItem[] = items.map(item => ({
          id: item.id,
          productId: item.stickerId,
          product: item.sticker,
          quantity: item.quantity
        }));
        this.cartItems.set(mappedItems);
        this.saveToStorage(mappedItems);
      }),
      catchError(err => {
        console.error('Cart sync failed', err);
        return of([]);
      })
    ).subscribe();
  }

  syncAfterLogin() {
    const localItems = this.cartItems();
    if (localItems.length === 0) {
      this.syncWithServer();
      return;
    }

    // Merge local items to server
    const requests = localItems.map(item => 
      this.http.post(`${this.API_URL}/add`, { 
        stickerId: item.product.id, 
        quantity: item.quantity 
      })
    );

    forkJoin(requests).pipe(
      catchError(err => {
        console.error('Failed to merge local cart to server', err);
        return of([]);
      }),
      tap(() => this.syncWithServer())
    ).subscribe();
  }

  addToCart(product: Product) {
    // Optimistic Update
    this.cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { product, quantity: 1 }];
    });

    this.http.post(`${this.API_URL}/add`, { stickerId: product.id, quantity: 1 }).pipe(
      catchError(() => of(null))
    ).subscribe(() => this.saveToStorage(this.cartItems()));
  }

  updateQuantity(productId: string, delta: number) {
    const item = this.cartItems().find(i => i.product.id === productId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    this.cartItems.update(items => 
      items.map(i => i.product.id === productId ? { ...i, quantity: newQty } : i)
    );

    const cartItem = this.cartItems().find(i => i.product.id === productId);
    if (cartItem?.id) {
      this.http.patch(`${this.API_URL}/update/${cartItem.id}`, { quantity: newQty }).subscribe();
    }
    this.saveToStorage(this.cartItems());
  }

  removeFromCart(productId: string) {
    const item = this.cartItems().find(i => i.product.id === productId);
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
    
    if (item?.id) {
      this.http.delete(`${this.API_URL}/remove/${item.id}`).subscribe();
    }
    this.saveToStorage(this.cartItems());
  }

  getCartItems() {
    return this.cartItems();
  }

  clearCart() {
    this.cartItems.set([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private loadFromStorage(): CartItem[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveToStorage(items: CartItem[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    }
  }
}
