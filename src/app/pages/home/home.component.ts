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
            <div class="section-header text-center animate-in">
                <span class="section-tag">Explore Collections</span>
                <h2 class="section-title">Shop by Category</h2>
                <p class="section-subtitle">Find the perfect stickers for your stack from our curated collections.</p>
            </div>
            
            <div class="category-grid">
                @for (cat of featuredCategories; track cat.name) {
                    <div class="category-card glass-card animate-in" [routerLink]="['/collections']">
                        <div class="category-img-wrapper shimmer-effect">
                            <img [ngSrc]="cat.image" [alt]="cat.name" width="200" height="200">
                        </div>
                        <div class="category-info">
                            <h3>{{ cat.name }}</h3>
                            <div class="category-footer">
                                <p>{{ cat.count }} Stickers</p>
                                <span class="arrow">→</span>
                            </div>
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
        <div class="container">
            <div class="benefits-grid">
                <div class="benefit-card glass-panel hover-lift">
                    <div class="benefit-icon-wrapper">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <h3>Global Shipping</h3>
                    <p>We ship our stickers to developers all around the world with fully tracked express delivery.</p>
                </div>
                <div class="benefit-card glass-panel hover-lift">
                    <div class="benefit-icon-wrapper purple">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"></path><path d="M11 3v19"></path><path d="M5 9h14"></path><path d="m14 3-5 6 5 6"></path></svg>
                    </div>
                    <h3>Premium Quality</h3>
                    <p>Weather-proof, durable vinyl with a matte finish that looks great on any laptop surface.</p>
                </div>
                <div class="benefit-card glass-panel hover-lift">
                    <div class="benefit-icon-wrapper green">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <h3>Secure Payment</h3>
                    <p>Fully encrypted checkout process supporting cards, PayPal, and major cryptocurrencies.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter-section">
        <div class="container newsletter-container glass-panel">
            <div class="newsletter-content">
                <span class="section-tag">Newsletter</span>
                <h2>Join the Dev Sticker Club</h2>
                <p>Subscribe to get special offers, free sticker giveaways, and once-in-a-lifetime deals.</p>
                <form class="newsletter-form" (submit)="$event.preventDefault()">
                    <div class="input-wrapper">
                        <input type="email" placeholder="email@example.com">
                    </div>
                    <button type="submit" class="btn btn-primary">Subscribe Now</button>
                </form>
            </div>
        </div>
    </section>
  `,
    styles: [`
    .section-header {
        margin-bottom: var(--spacing-lg);
    }

    .section-tag {
        display: inline-block;
        color: var(--accent-blue);
        font-weight: 700;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        margin-bottom: 1rem;
    }
    
    .section-title {
        font-size: clamp(2rem, 5vw, 3rem);
        margin-bottom: 1rem;
    }

    .section-subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
        max-width: 600px;
        margin: 0 auto;
    }

    .category-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
    }

    .category-card {
        padding: 1.5rem;
        text-align: left;
    }

    .category-img-wrapper {
        background: rgba(0,0,0,0.3);
        border-radius: 12px;
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
        max-width: 140px;
        filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .category-card:hover .category-img-wrapper img {
        transform: scale(1.15) rotate(5deg);
    }

    .category-info h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
    }

    .category-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-secondary);
    }

    .category-footer p { font-size: 0.9rem; font-weight: 500; }
    .arrow { color: var(--accent-blue); font-size: 1.2rem; transition: transform 0.3s ease; }
    .category-card:hover .arrow { transform: translateX(5px); }

    .benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2.5rem;
    }

    .benefit-card {
        padding: 3rem 2rem;
        text-align: center;
        background: rgba(13, 17, 23, 0.4);
    }

    .benefit-icon-wrapper {
        width: 64px;
        height: 64px;
        background: rgba(88, 166, 255, 0.1);
        color: var(--accent-blue);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 2rem;
        border: 1px solid rgba(88, 166, 255, 0.2);
        box-shadow: 0 0 20px rgba(88, 166, 255, 0.1);
    }

    .benefit-icon-wrapper.purple {
        background: rgba(188, 140, 255, 0.1);
        color: var(--accent-purple);
        border-color: rgba(188, 140, 255, 0.2);
    }

    .benefit-icon-wrapper.green {
        background: rgba(63, 185, 80, 0.1);
        color: var(--accent-green);
        border-color: rgba(63, 185, 80, 0.2);
    }

    .benefit-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .benefit-card p {
        color: var(--text-secondary);
        line-height: 1.7;
        font-size: 0.95rem;
    }

    .newsletter-section {
        padding: var(--spacing-xl) 0;
    }

    .newsletter-container {
        padding: 4rem;
        background: linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(5, 7, 10, 0.9) 100%);
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .newsletter-container::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -30%;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(var(--accent-blue-rgb), 0.1) 0%, transparent 70%);
        filter: blur(40px);
    }

    .newsletter-content {
        position: relative;
        z-index: 1;
    }

    .newsletter-container h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .newsletter-container p {
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-bottom: 2.5rem;
    }

    .newsletter-form {
        display: flex;
        gap: 1rem;
        max-width: 500px;
        margin: 0 auto;
    }

    .input-wrapper {
        flex: 1;
    }

    .newsletter-form input {
        width: 100%;
        padding: 0.875rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        color: white;
        font-size: 1rem;
        transition: all 0.3s;
    }

    .newsletter-form input:focus {
        outline: none;
        border-color: var(--accent-blue);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 15px rgba(var(--accent-blue-rgb), 0.2);
    }

    @media (max-width: 768px) {
        .newsletter-container { padding: 3rem 1.5rem; }
        .newsletter-form { flex-direction: column; }
        .newsletter-container h2 { font-size: 2rem; }
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
