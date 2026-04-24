import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/product.model';
import { Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/orders';

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/create`, orderData);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL).pipe(
      catchError(err => {
        console.error('Failed to fetch orders', err);
        return of([]);
      })
    );
  }

  // ADMIN
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/admin/all`, {
      headers: { 'x-admin-key': 'supersecret' }
    });
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/${id}/status`, { status }, {
      headers: { 'x-admin-key': 'supersecret' }
    });
  }
}
