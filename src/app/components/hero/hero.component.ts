import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-hero',
    imports: [RouterModule],
    template: `
    <section class="hero animate-in">
        <div class="container hero-container">
            <h1>Upgrade Your Hardware <br> with <span class="accent-text">Premium Decals</span></h1>
            <p>High-quality, durable vinyl stickers designed specifically for the developer community. From mascots to code snippets, we've got you covered.</p>
            <div class="hero-actions">
                <button class="btn btn-primary btn-lg" [routerLink]="['/collections']">Browse Collection</button>
            </div>
        </div>
    </section>
  `,
    styles: [`
    .hero {
        padding: var(--spacing-lg) 0;
        text-align: center;
        background: radial-gradient(circle at center, rgba(88, 166, 255, 0.1), transparent 70%);
    }

    .hero h1 {
        font-size: 3.5rem;
        margin-bottom: var(--spacing-sm);
        background: linear-gradient(135deg, #fff 0%, #8b949e 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .accent-text {
        color: var(--accent-blue);
        -webkit-text-fill-color: var(--accent-blue);
        text-shadow: 0 0 20px rgba(88, 166, 255, 0.4);
    }

    .hero p {
        font-size: 1.25rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto var(--spacing-md);
    }

    @media (max-width: 768px) {
        .hero h1 {
            font-size: 2.5rem;
        }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent { }

