import { Component, inject, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  template: `
    <div class="product-detail-container">
      @if (product(); as p) {
        <div class="back-link">
          <a routerLink="/" class="btn-text">← Back to Gallery</a>
        </div>
        
        <div class="product-detail-grid">
          <div class="product-image-section">
            <div class="image-card">
              <img [ngSrc]="p.image" [alt]="p.name" width="400" height="400" priority="true">
            </div>
          </div>
          
          <div class="product-info-section">
            <span class="product-tag">{{ p.tag }}</span>
            <h1 class="product-title">{{ p.name }}</h1>
            <p class="product-price">{{ p.price | currency }}</p>
            
            <div class="product-description">
              <h2>Description</h2>
              <p>{{ p.description }}</p>
            </div>
            
            <div class="action-section">
              <button class="btn btn-primary btn-large" (click)="addToCart(p)">
                Add to Bag
              </button>
            </div>
            
            <div class="features-list">
              <div class="feature-item">
                <span class="icon">✨</span>
                <span>High-quality vinyl sticker</span>
              </div>
              <div class="feature-item">
                <span class="icon">🛡️</span>
                <span>Weather-proof and durable</span>
              </div>
              <div class="feature-item">
                <span class="icon">🚀</span>
                <span>Fast shipping worldwide</span>
              </div>
            </div>
          </div>
        </div>
      } @else if (!loading()) {
        <div class="not-found">
          <h2>Product not found</h2>
          <a routerLink="/" class="btn btn-primary">Back to Home</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--spacing-xl) var(--spacing-md);
      animation: fadeIn 0.6s ease-out;
    }

    .back-link {
      margin-bottom: var(--spacing-lg);
    }

    .btn-text {
      color: var(--text-secondary);
      text-decoration: none;
      font-family: 'JetBrains Mono', monospace;
      transition: color 0.3s ease;
    }

    .btn-text:hover {
      color: var(--accent-blue);
    }

    .product-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-xl);
      align-items: start;
    }

    @media (max-width: 768px) {
      .product-detail-grid {
        grid-template-columns: 1fr;
      }
    }

    .product-image-section {
      position: sticky;
      top: 100px;
    }

    .image-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: var(--spacing-xl);
      display: flex;
      justify-content: center;
      align-items: center;
      aspect-ratio: 1;
      box-shadow: var(--glow-blue);
    }

    .image-card img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }

    .product-info-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .product-tag {
      background: rgba(0, 243, 255, 0.1);
      color: var(--accent-blue);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      width: fit-content;
      font-family: 'JetBrains Mono', monospace;
      border: 1px solid rgba(0, 243, 255, 0.2);
    }

    .product-title {
      font-size: 3rem;
      margin: 0;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .product-price {
      font-size: 2rem;
      color: var(--accent-green);
      font-weight: 700;
      margin: 0;
      font-family: 'JetBrains Mono', monospace;
    }

    .product-description {
      margin-top: var(--spacing-md);
    }

    .product-description h2 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .product-description p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-primary);
    }

    .action-section {
      margin: var(--spacing-lg) 0;
    }

    .btn-large {
      width: 100%;
      padding: 1.2rem;
      font-size: 1.2rem;
      border-radius: 12px;
    }

    .features-list {
      display: grid;
      gap: 1rem;
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-color);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-secondary);
    }

    .icon {
      font-size: 1.2rem;
    }

    .not-found {
      text-align: center;
      padding: 100px 20px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  loading = signal(true);

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.product.set(this.productService.getProductById(productId));
    }
    this.loading.set(false);
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
