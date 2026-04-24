import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-hero',
    imports: [RouterModule],
    template: `
    <section class="hero animate-in">
        <div class="hero-glow"></div>
        <div class="container hero-container">
            <div class="hero-badge">New Arrival: Cyberpunk Collection ⚡</div>
            <h1>Upgrade Your Hardware <br> with <span class="accent-text">Premium Decals</span></h1>
            <p>High-quality, durable vinyl stickers designed specifically for the developer community. From mascots to code snippets, we've got you covered.</p>
            <div class="hero-actions">
                <button class="btn btn-primary" [routerLink]="['/collections']">
                    Browse Collection
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
            </div>
        </div>
    </section>
  `,
    styles: [`
    .hero {
        padding: var(--spacing-xl) 0;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .hero-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 60%;
        background: radial-gradient(circle, rgba(var(--accent-blue-rgb), 0.15) 0%, transparent 70%);
        filter: blur(60px);
        z-index: 0;
        pointer-events: none;
    }

    .hero-container {
        position: relative;
        z-index: 1;
    }

    .hero-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        background: rgba(88, 166, 255, 0.1);
        border: 1px solid rgba(88, 166, 255, 0.2);
        color: var(--accent-blue);
        border-radius: 100px;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 2rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .hero h1 {
        font-size: clamp(2.5rem, 8vw, 4.5rem);
        margin-bottom: 1.5rem;
        background: linear-gradient(to bottom, #fff, #999);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.1;
    }

    .accent-text {
        color: var(--accent-blue);
        -webkit-text-fill-color: var(--accent-blue);
        text-shadow: 0 0 30px rgba(var(--accent-blue-rgb), 0.3);
    }

    .hero p {
        font-size: 1.25rem;
        color: var(--text-secondary);
        max-width: 650px;
        margin: 0 auto 3rem;
        line-height: 1.7;
    }

    @media (max-width: 768px) {
        .hero { padding: var(--spacing-lg) 0; }
        .hero-badge { font-size: 0.7rem; }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent { }

