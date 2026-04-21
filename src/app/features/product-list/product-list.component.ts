import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <section class="products">
        <div class="container">
            <div class="product-grid">
                @for (product of productService.products(); track product.id) {
                    <app-product-card [product]="product"></app-product-card>
                }
            </div>
        </div>
    </section>
  `,
  styles: [`
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--spacing-md);
        padding: var(--spacing-lg) 0;
    }
  `]
})
export class ProductListComponent {
  productService = inject(ProductService);
}
