import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;
  const mockProduct: Product = {
    id: 'test',
    name: 'Test',
    price: 10,
    imageUrl: '',
    category: '',
    description: '',
    stock: 100
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clearCart();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    service.addToCart(mockProduct);
    expect(service.cartCount()).toBe(1);
    expect(service.getCartItems()[0].quantity).toBe(1);
  });

  it('should increment quantity if same item added', () => {
    service.addToCart(mockProduct);
    service.addToCart(mockProduct);
    expect(service.cartCount()).toBe(2);
    expect(service.getCartItems().length).toBe(1);
    expect(service.getCartItems()[0].quantity).toBe(2);
  });

  it('should calculate subtotal correctly', () => {
    service.addToCart(mockProduct);
    service.addToCart({ ...mockProduct, id: 'test2', price: 20 });
    expect(service.subtotal()).toBe(30);
  });

  it('should update quantity', () => {
    service.addToCart(mockProduct);
    service.updateQuantity('test', 2);
    expect(service.getCartItems()[0].quantity).toBe(3);
    service.updateQuantity('test', -1);
    expect(service.getCartItems()[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    service.addToCart(mockProduct);
    service.removeFromCart('test');
    expect(service.cartCount()).toBe(0);
  });
});
