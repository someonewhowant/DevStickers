import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-support',
    template: `
    <div class="container support-page animate-in">
        <header class="support-header">
            <h1>Support & FAQ</h1>
            <p>Need help with your order? We've got you covered.</p>
        </header>

        <div class="support-content">
            <section class="faq">
                <div class="faq-item">
                    <h4>What is the shipping time?</h4>
                    <p>Domestic orders take 3-5 business days. International orders can take 10-15 business days.</p>
                </div>
                <div class="faq-item">
                    <h4>Are the stickers waterproof?</h4>
                    <p>Yes! Every sticker is made from high-quality, durable vinyl that is both water and sun resistant.</p>
                </div>
                <div class="faq-item">
                    <h4>Can I request a custom design?</h4>
                    <p>Currently, we only sell our curated collections, but we're planning a "Custom Pull Request" feature soon!</p>
                </div>
            </section>

            <aside class="contact-card">
                <h3>Still have questions?</h3>
                <p>Send us a ping at <strong>support@devstickers.io</strong></p>
                <div class="social-pills">
                    <span class="tag">Discord</span>
                    <span class="tag">Twitter</span>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;">Open Support Ticket</button>
            </aside>
        </div>
    </div>
  `,
    styles: [`
    .support-page { padding: var(--spacing-lg) var(--spacing-sm); }
    .support-header { text-align: center; margin-bottom: var(--spacing-lg); }
    .support-header h1 { font-size: 3rem; margin-bottom: var(--spacing-sm); }
    .support-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: var(--spacing-lg);
    }
    .faq-item { margin-bottom: var(--spacing-md); }
    .faq-item h4 { color: var(--accent-blue); margin-bottom: 0.5rem; }
    .contact-card {
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        padding: var(--spacing-md);
        border-radius: 12px;
        height: fit-content;
        position: sticky;
        top: 100px;
    }
    .contact-card h3 { margin-bottom: 1rem; }
    .social-pills { display: flex; gap: 0.5rem; margin-top: 1rem; }
    @media (max-width: 768px) {
        .support-content { grid-template-columns: 1fr; }
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportComponent { }
