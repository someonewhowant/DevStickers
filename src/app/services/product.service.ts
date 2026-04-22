import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private STORAGE_KEY = 'sticker_inventory';

  private initialProducts: Product[] = [
    { id: 'gopher', name: 'The Hardcore Gopher', price: 5, image: '/assets/images/gopher.png', tag: 'Go Lang', description: 'This gopher is built for speed and efficiency. A perfect companion for your Go projects.' },
    { id: 'rust', name: 'Safe & Fast Ferris', price: 5, image: '/assets/images/ferris.png', tag: 'Rust', description: 'Ferris the crab is here to ensure your code is memory-safe and blazingly fast.' },
    { id: 'cat', name: 'Root Kitty', price: 6, image: '/assets/images/cat.png', tag: 'Hacking', description: 'Every hacker needs a companion. Root Kitty is always there to watch your terminal.' },
    { id: 'python', name: 'Cyber Serpent', price: 5, image: '/assets/images/python.png', tag: 'Python', description: 'The cyber serpent is elegant, readable, and ready to automate everything.' },
    { id: 'js', name: 'Async Master', price: 5, image: '/assets/images/js.png', tag: 'JavaScript', description: 'Dominate the web with the Async Master sticker. It won\'t block your main thread.' },
    { id: 'ts', name: 'Typed Hero', price: 6, image: '/assets/images/js.png', tag: 'TypeScript', description: 'Static typing for a dynamic world. The Typed Hero is here to save your production.' },
    { id: 'react', name: 'Reactive Atomic', price: 5, image: '/assets/images/js.png', tag: 'React', description: 'Components everywhere! Build complex UIs from simple atoms with this sticker.' },
    { id: 'angular', name: 'Enterprise Power', price: 7, image: '/assets/images/js.png', tag: 'Angular', description: 'The platform for the modern web developer. Scale your apps to infinity.' },
    { id: 'vue', name: 'Progressive View', price: 5, image: '/assets/images/js.png', tag: 'Vue', description: 'The progressive framework. Simple, approachable, and versatile.' },
    { id: 'docker', name: 'Container Whale', price: 6, image: '/assets/images/gopher.png', tag: 'DevOps', description: 'Ship it with confidence. Your application, anywhere, in a neat container.' },
    { id: 'k8s', name: 'Cloud Captain', price: 8, image: '/assets/images/gopher.png', tag: 'DevOps', description: 'Orchestrate your containers like a pro. The helm is in your hands.' },
    { id: 'git', name: 'Commit Master', price: 4, image: '/assets/images/cat.png', tag: 'Tools', description: 'Never lose a line of code. Branch, commit, and merge with style.' }
  ];

  products = signal<Product[]>(this.loadProducts());

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  private loadProducts(): Product[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.initialProducts;
    }
    return this.initialProducts;
  }

  private saveToStorage(products: Product[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }
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
