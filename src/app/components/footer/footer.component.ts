import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">./DevStickers</div>
                <div class="footer-links">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a [routerLink]="['/admin']" class="admin-link">Admin</a>
                </div>
            </div>
            <div class="copyright">
                &copy; 2026 DevStickers Store. Built with Angular & Signal Power.
            </div>
        </div>
    </footer>
  `,
  styles: [`
    footer {
        border-top: 1px solid var(--border-color);
        padding: var(--spacing-lg) 0 var(--spacing-md);
        margin-top: var(--spacing-lg);
    }
    .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
    }
    .footer-logo { font-family: 'JetBrains Mono', monospace; font-weight: 700; opacity: 0.7; }
    .footer-links { display: flex; gap: var(--spacing-md); }
    .footer-links a { color: var(--text-secondary); font-size: 0.9rem; }
    .copyright { text-align: center; color: var(--text-secondary); font-size: 0.8rem; margin-top: var(--spacing-md); }
    .admin-link { opacity: 0.3; transition: opacity 0.3s; }
    .admin-link:hover { opacity: 1; color: var(--accent-blue); }
  `]
})
export class FooterComponent { }
