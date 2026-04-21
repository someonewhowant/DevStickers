import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, Product } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card animate-in" [id]="'sticker-' + product.id">
        <div class="image-wrapper">
            <img [src]="product.image" [alt]="product.name" loading="lazy">
            <div class="overlay">
                <button class="btn btn-primary" (click)="addToCart()">
                    Add to Bag
                </button>
            </div>
        </div>
        <div class="card-content">
            <span class="tag">{{ product.tag }}</span>
            <h3>{{ product.name }}</h3>
            <p class="price">{{ product.price | currency }}</p>
        </div>
    </div>
  `,
  styles: [`
    .product-card {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        height: 100%;
        position: relative;
    }

    .product-card:hover {
        transform: translateY(-8px);
        border-color: var(--accent-blue);
        box-shadow: var(--glow-blue);
    }

    .image-wrapper {
        position: relative;
        padding: var(--spacing-md);
        background: var(--card-bg);
        display: flex;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1;
        overflow: hidden;
    }

    .image-wrapper img {
        width: 100%;
        max-width: 160px;
        transition: transform 0.5s ease;
    }

    .product-card:hover .image-wrapper img {
        transform: scale(1.1) rotate(5deg);
    }

    .overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 1rem;
        background: linear-gradient(to top, rgba(13, 17, 23, 0.9), transparent);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        display: flex;
        justify-content: center;
    }

    .product-card:hover .overlay {
        opacity: 1;
        transform: translateY(0);
    }

    .card-content {
        padding: var(--spacing-sm);
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex-grow: 1;
    }

    .card-content h3 {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.1rem;
        margin: 0;
    }

    .price {
        font-weight: 700;
        color: var(--accent-green);
        margin: 0;
        font-size: 1.2rem;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  cartService = inject(CartService);

  addToCart() {
    this.cartService.addToCart(this.product);
  }
}
