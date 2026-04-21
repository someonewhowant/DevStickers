import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private STORAGE_KEY = 'sticker_inventory';

  private initialProducts: Product[] = [
    { id: 'gopher', name: 'The Hardcore Gopher', price: 5, image: '/assets/images/gopher.png', tag: 'Go Lang' },
    { id: 'rust', name: 'Safe & Fast Ferris', price: 5, image: '/assets/images/ferris.png', tag: 'Rust' },
    { id: 'cat', name: 'Root Kitty', price: 6, image: '/assets/images/cat.png', tag: 'Hacking' },
    { id: 'python', name: 'Cyber Serpent', price: 5, image: '/assets/images/python.png', tag: 'Python' },
    { id: 'js', name: 'Async Master', price: 5, image: '/assets/images/js.png', tag: 'JavaScript' }
  ];

  products = signal<Product[]>(this.loadProducts());

  private loadProducts(): Product[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.initialProducts;
  }

  private saveToStorage(products: Product[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }

  addProduct(product: Product) {
    this.products.update(items => {
      const newItems = [...items, product];
      this.saveToStorage(newItems);
      return newItems;
    });
  }

  updateProduct(updatedProduct: Product) {
    this.products.update(items => {
      const newItems = items.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      this.saveToStorage(newItems);
      return newItems;
    });
  }

  deleteProduct(productId: string) {
    this.products.update(items => {
      const newItems = items.filter(p => p.id !== productId);
      this.saveToStorage(newItems);
      return newItems;
    });
  }

  resetToDefaults() {
    this.products.set(this.initialProducts);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
