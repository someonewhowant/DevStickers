import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get product by id', () => {
    const product = service.getProductById('gopher');
    expect(product).toBeTruthy();
    expect(product?.id).toBe('gopher');
  });

  it('should return undefined for non-existent product id', () => {
    const product = service.getProductById('invalid-id');
    expect(product).toBeUndefined();
  });
});
