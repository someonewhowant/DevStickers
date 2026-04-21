import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../features/product-list/product-list.component';

@Component({
  selector: 'app-collections',
  imports: [CommonModule, ProductListComponent],
  template: `
    <div class="container collections-page animate-in">
        <aside class="sidebar">
            <h3>Collections</h3>
            <ul class="filter-list">
                <li [class.active]="selected() === 'All'" (click)="select('All')">All Stickers</li>
                <li [class.active]="selected() === 'Languages'" (click)="select('Languages')">Languages</li>
                <li [class.active]="selected() === 'Mascots'" (click)="select('Mascots')">Mascots</li>
                <li [class.active]="selected() === 'Hacking'" (click)="select('Hacking')">Cybersecurity</li>
            </ul>
        </aside>
        
        <main class="content">
            <header class="collection-header">
                <h2>{{ selected() }} Collection</h2>
                <p>Showing 5 premium stickers</p>
            </header>
            <app-product-list></app-product-list>
        </main>
    </div>
  `,
  styles: [`
    .collections-page {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: var(--spacing-lg);
        padding: var(--spacing-lg) var(--spacing-sm);
    }
    .sidebar h3 { margin-bottom: var(--spacing-md); font-family: 'JetBrains Mono', monospace; }
    .filter-list { list-style: none; }
    .filter-list li {
        padding: 0.75rem 0;
        color: var(--text-secondary);
        cursor: pointer;
        transition: color 0.3s ease;
        border-bottom: 1px solid var(--border-color);
    }
    .filter-list li:hover, .filter-list li.active { color: var(--accent-blue); }
    .filter-list li.active { font-weight: 700; border-bottom-color: var(--accent-blue); }
    
    .collection-header { margin-bottom: var(--spacing-md); }
    .collection-header h2 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    
    @media (max-width: 768px) {
        .collections-page { grid-template-columns: 1fr; }
        .sidebar { display: none; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionsComponent {
  selected = signal('All');

  select(category: string) {
    this.selected.set(category);
  }
}
