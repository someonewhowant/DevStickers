import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductListComponent } from '../../features/product-list/product-list.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgOptimizedImage, RouterModule, HeroComponent, ProductListComponent],
  template: `
    <app-hero></app-hero>

    <!-- Featured Categories -->
    <section class="section-padding">
        <div class="container">
            <div class="section-header text-center">
                <h2 class="section-title">Shop by Category</h2>
                <p class="section-subtitle">Find the perfect stickers for your stack</p>
            </div>
            
            <div class="category-grid">
                @for (cat of featuredCategories; track cat.name) {
                    <div class="category-card" [routerLink]="['/collections']">
                        <div class="category-img-wrapper">
                            <img [ngSrc]="cat.image" [alt]="cat.name" width="200" height="200">
                        </div>
                        <div class="category-info">
                            <h3>{{ cat.name }}</h3>
                            <p>{{ cat.count }} Stickers</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    </section>

    <!-- Main Product Catalog -->
    <app-product-list></app-product-list>

    <!-- Benefits Section -->
    <section class="benefits-section section-padding">
        <div class="container benefits-grid">
            <div class="benefit-card">
                <span class="benefit-icon">🌎</span>
                <h3>Global Shipping</h3>
                <p>We ship our stickers to developers all around the world with tracked delivery.</p>
            </div>
            <div class="benefit-card">
                <span class="benefit-icon">💎</span>
                <h3>Premium Quality</h3>
                <p>Weather-proof, durable vinyl that looks great on any laptop or workstation.</p>
            </div>
            <div class="benefit-card">
                <span class="benefit-icon">🛡️</span>
                <h3>Secure Payment</h3>
                <p>Fully encrypted checkout process supporting cards and major cryptocurrencies.</p>
            </div>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter-section">
        <div class="container newsletter-container">
            <h2>Join the Dev Sticker Club</h2>
            <p>Subscribe to get special offers, free sticker giveaways, and once-in-a-lifetime deals.</p>
            <form class="newsletter-form" (submit)="$event.preventDefault()">
                <input type="email" placeholder="Enter your email address">
                <button type="submit" class="btn btn-primary">Subscribe</button>
            </form>
        </div>
    </section>
  `,
  styles: [`
    .section-header {
        margin-bottom: var(--spacing-lg);
    }
    
    .section-title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }

    .section-subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
    }

    .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-md);
    }

    .category-card {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: var(--spacing-md);
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .category-card:hover {
        transform: translateY(-10px);
        border-color: var(--accent-blue);
        box-shadow: var(--glow-blue);
    }

    .category-img-wrapper {
        background: var(--card-bg);
        border-radius: 15px;
        padding: 2rem;
        margin-bottom: 1.5rem;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .category-img-wrapper img {
        width: 100%;
        height: auto;
        max-width: 150px;
    }

    .category-info h3 {
        font-size: 1.4rem;
        margin-bottom: 0.25rem;
    }

    .category-info p {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
    }

    .benefit-card {
        text-align: center;
    }

    .benefit-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        display: block;
    }

    .benefit-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .benefit-card p {
        color: var(--text-secondary);
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .category-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .category-grid {
            grid-template-columns: 1fr;
        }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  featuredCategories = [
    { name: 'Mascots', image: '/assets/images/gopher.png', count: 12 },
    { name: 'Languages', image: '/assets/images/python.png', count: 24 },
    { name: 'Frameworks', image: '/assets/images/js.png', count: 18 },
    { name: 'Cybersecurity', image: '/assets/images/cat.png', count: 8 }
  ];
}
