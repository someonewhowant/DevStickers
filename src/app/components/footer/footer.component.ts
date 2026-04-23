import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  template: `
    <footer class="footer-section">
        <div class="container footer-grid">
            <!-- Brand Column -->
            <div class="footer-col brand-col">
                <div class="footer-logo">./DevStickers</div>
                <p class="brand-desc">Premium quality vinyl decals for the modern developer. Upgrade your hardware with the best tools of the trade.</p>
                <div class="social-links">
                    <a href="#" class="social-icon">𝕏</a>
                    <a href="#" class="social-icon">📸</a>
                    <a href="#" class="social-icon">🐙</a>
                </div>
            </div>

            <!-- Shop Column -->
            <div class="footer-col">
                <h4>Shop</h4>
                <ul class="footer-links">
                    <li><a [routerLink]="['/']">All Stickers</a></li>
                    <li><a [routerLink]="['/collections']">New Arrivals</a></li>
                    <li><a [routerLink]="['/collections']">Best Sellers</a></li>
                    <li><a [routerLink]="['/collections']">Mascots</a></li>
                </ul>
            </div>

            <!-- Support Column -->
            <div class="footer-col">
                <h4>Support</h4>
                <ul class="footer-links">
                    <li><a [routerLink]="['/support']">Shipping Policy</a></li>
                    <li><a [routerLink]="['/support']">Return Center</a></li>
                    <li><a [routerLink]="['/support']">Contact Us</a></li>
                    <li><a [routerLink]="['/support']">FAQs</a></li>
                </ul>
            </div>

            <!-- Company Column -->
            <div class="footer-col">
                <h4>Company</h4>
                <ul class="footer-links">
                    <li><a [routerLink]="['/about']">Our Story</a></li>
                    <li><a [routerLink]="['/about']">Sustainability</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a [routerLink]="['/admin']">Merchant Portal</a></li>
                </ul>
            </div>
        </div>

        <div class="container footer-bottom">
            <div class="copyright">
                &copy; 2026 DevStickers Store. Built with Angular & Signal Power.
            </div>
            <div class="payment-icons">
                <span title="Visa">💳</span>
                <span title="Mastercard">🎴</span>
                <span title="Bitcoin">₿</span>
                <span title="Ethereum">Ξ</span>
            </div>
        </div>
    </footer>
  `,
  styles: [`
    .footer-grid {
        display: grid;
        grid-template-columns: 1.5fr repeat(3, 1fr);
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
    }

    .footer-col h4 {
        color: white;
        font-size: 1rem;
        margin-bottom: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .brand-desc {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 1.5rem 0;
        max-width: 300px;
    }

    .footer-logo {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.4rem;
        font-weight: 800;
        color: var(--accent-blue);
    }

    .footer-links {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .footer-links a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
    }

    .footer-links a:hover {
        color: var(--accent-blue);
    }

    .social-links {
        display: flex;
        gap: 1rem;
    }

    .social-icon {
        width: 36px;
        height: 36px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        transition: all 0.2s;
    }

    .social-icon:hover {
        border-color: var(--accent-blue);
        color: var(--accent-blue);
        transform: translateY(-3px);
    }

    .footer-bottom {
        border-top: 1px solid var(--border-color);
        padding-top: var(--spacing-md);
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-secondary);
        font-size: 0.8rem;
    }

    .payment-icons {
        display: flex;
        gap: 1rem;
        font-size: 1.5rem;
        filter: grayscale(1);
        opacity: 0.5;
    }

    @media (max-width: 900px) {
        .footer-grid {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 480px) {
        .footer-grid {
            grid-template-columns: 1fr;
        }
        .footer-bottom {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
        }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent { }
