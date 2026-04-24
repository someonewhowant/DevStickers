import { firstValueFrom } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

    // Handle initial refreshProducts() call from constructor
    const req = httpMock.expectOne('/api/stickers');
    req.flush({ data: [], total: 0, page: 1, limit: 10 });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get product by id', async () => {
    const mockProduct = { id: 'gopher', name: 'Gopher', price: 10, imageUrl: '', category: '', stock: 10 };

    const productPromise = firstValueFrom(service.getProductById('gopher'));

    const req = httpMock.expectOne('/api/stickers/gopher');
    req.flush(mockProduct);

    const product = await productPromise;
    expect(product).toBeTruthy();
    expect(product?.id).toBe('gopher');
  });

  it('should return null for non-existent product id', async () => {
    const productPromise = firstValueFrom(service.getProductById('invalid-id'));

    const req1 = httpMock.expectOne('/api/stickers/invalid-id');
    req1.error(new ErrorEvent('Not Found'), { status: 404 });

    // Handle the retry request
    const req2 = httpMock.expectOne('/api/stickers/invalid-id');
    req2.error(new ErrorEvent('Not Found'), { status: 404 });

    const product = await productPromise;
    expect(product).toBeNull();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
