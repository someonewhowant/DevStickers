import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { catchError, retry, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/stickers';
  private readonly STORAGE_KEY = 'sticker_inventory_cache';

  products = signal<Product[]>(this.loadFromStorage());
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.refreshProducts();
  }

  refreshProducts() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ApiResponse<Product>>(this.API_URL).pipe(
      retry(2),
      tap(response => {
        this.products.set(response.data);
        this.saveToStorage(response.data);
        this.loading.set(false);
      }),
      catchError(err => {
        console.error('API Error, using fallback:', err);
        this.error.set('Failed to load fresh data. Using offline cache.');
        this.loading.set(false);
        return of(null);
      })
    ).subscribe();
  }

  getProductById(id: string): Observable<Product | null> {
    const local = this.products().find(p => p.id === id);
    if (local) return of(local);

    return this.http.get<Product>(`${this.API_URL}/${id}`).pipe(
      retry(1),
      catchError(() => of(null))
    );
  }

  addProduct(product: any, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    Object.keys(product).forEach(key => formData.append(key, product[key]));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Product>(this.API_URL, formData, {
      headers: { 'x-admin-key': 'supersecret' }
    }).pipe(
      tap(() => this.refreshProducts())
    );
  }

  updateProduct(id: string, product: any, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    Object.keys(product).forEach(key => formData.append(key, product[key]));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.patch<Product>(`${this.API_URL}/${id}`, formData, {
      headers: { 'x-admin-key': 'supersecret' }
    }).pipe(
      tap(() => this.refreshProducts())
    );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`, {
      headers: { 'x-admin-key': 'supersecret' }
    }).pipe(
      tap(() => this.refreshProducts())
    );
  }

  resetToDefaults() {
    this.refreshProducts();
  }

  private loadFromStorage(): Product[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveToStorage(products: Product[]) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    }
  }
}
