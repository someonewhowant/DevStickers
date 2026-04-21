import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    standalone: true,
    template: `
    <div class="container about-page animate-in">
        <section class="about-hero">
            <span class="tag">Since 2026</span>
            <h1>The Story Behind <br> ./DevStickers</h1>
            <p>Started by developers, for developers. We believe your hardware should reflect your passion for code.</p>
        </section>

        <section class="mission-grid">
            <div class="card">
                <h3>Quality First</h3>
                <p>All stickers are printed on durable, weatherproof vinyl with a premium matte finish. Built to survive coffee spills and long nights.</p>
            </div>
            <div class="card">
                <h3>Community Driven</h3>
                <p>We collaborate with open-source artists to bring you the most authentic and unique designs in the ecosystem.</p>
            </div>
            <div class="card">
                <h3>Global Shipping</h3>
                <p>From Silicon Valley to Tokyo, we deliver our stickers to your door so you can decorate your rig anywhere.</p>
            </div>
        </section>
    </div>
  `,
    styles: [`
    .about-page {
        padding: var(--spacing-lg) var(--spacing-sm);
    }
    .about-hero {
        text-align: center;
        max-width: 800px;
        margin: 0 auto var(--spacing-lg);
    }
    .about-hero h1 {
        font-size: 3rem;
        margin: var(--spacing-sm) 0;
        background: linear-gradient(90deg, #fff, var(--text-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .mission-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-md);
    }
    .card {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        padding: var(--spacing-md);
        border-radius: 12px;
        transition: border-color 0.3s ease;
    }
    .card:hover { border-color: var(--accent-purple); }
    .card h3 { margin-bottom: var(--spacing-sm); color: var(--accent-purple); font-family: 'JetBrains Mono', monospace; }
  `]
})
export class AboutComponent { }
