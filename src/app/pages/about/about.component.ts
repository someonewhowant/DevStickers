import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-about',
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
        padding: var(--spacing-xl) var(--spacing-md);
        background: radial-gradient(circle at 50% 0%, rgba(138, 43, 226, 0.05), transparent 50%);
    }
    .about-hero {
        text-align: center;
        max-width: 900px;
        margin: 0 auto 6rem;
        padding: 4rem 2rem;
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: 40px;
        box-shadow: var(--glass-shadow);
    }
    .about-hero h1 {
        font-size: clamp(2.5rem, 8vw, 4.5rem);
        margin: var(--spacing-md) 0;
        background: linear-gradient(135deg, #fff 30%, var(--accent-blue), var(--accent-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.1;
        letter-spacing: -0.03em;
    }
    .about-hero p {
        font-size: 1.25rem;
        color: var(--text-secondary);
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
    }
    .mission-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
    }
    .card {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        padding: var(--spacing-xl);
        border-radius: 24px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: var(--glass-shadow);
    }
    .card:hover { 
        border-color: var(--accent-blue); 
        transform: translateY(-10px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(88, 166, 255, 0.1);
    }
    .card h3 { 
        margin-bottom: var(--spacing-md); 
        color: var(--accent-blue); 
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.5rem;
        letter-spacing: -0.02em;
    }
    .card p {
        color: var(--text-secondary);
        line-height: 1.7;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent { }
