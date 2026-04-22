import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCardComponent],
  template: `
    <section class="products">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Available Stickers</h2>
                <p class="section-subtitle">Choose your favorite stickers to customize your gear</p>
            </div>
            <div class="product-grid">
                @for (product of productService.products(); track product.id) {
                    <app-product-card [product]="product"></app-product-card>
                }
            </div>
        </div>
    </section>
  `,
  styles: [`
    .section-header {
        text-align: center;
        margin-bottom: var(--spacing-lg);
    }
    .section-title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .section-subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
    }
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--spacing-md);
        padding: var(--spacing-lg) 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  productService = inject(ProductService);
}
