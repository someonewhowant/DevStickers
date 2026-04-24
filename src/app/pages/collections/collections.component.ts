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
        grid-template-columns: 280px 1fr;
        gap: var(--spacing-xl);
        padding: var(--spacing-xl) var(--spacing-md);
    }
    .sidebar {
        background: var(--glass-bg);
        backdrop-filter: var(--glass-blur);
        border: 1px solid var(--glass-border);
        border-radius: 24px;
        padding: var(--spacing-lg);
        height: fit-content;
        position: sticky;
        top: 100px;
        box-shadow: var(--glass-shadow);
    }
    .sidebar h3 { 
        margin-bottom: var(--spacing-lg); 
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--text-secondary);
    }
    .filter-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .filter-list li {
        padding: 1rem 1.25rem;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 12px;
        border: 1px solid transparent;
        font-weight: 500;
    }
    .filter-list li:hover { 
        background: rgba(255, 255, 255, 0.03);
        color: white;
    }
    .filter-list li.active { 
        background: rgba(88, 166, 255, 0.1);
        color: var(--accent-blue); 
        border-color: rgba(88, 166, 255, 0.2);
        font-weight: 700;
    }
    
    .collection-header { margin-bottom: var(--spacing-xl); }
    .collection-header h2 { 
        font-size: 3.5rem; 
        margin-bottom: 0.5rem;
        letter-spacing: -0.03em;
        background: linear-gradient(to right, #fff, var(--text-secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .collection-header p { color: var(--text-secondary); font-size: 1.1rem; }
    
    @media (max-width: 1024px) {
        .collections-page { grid-template-columns: 1fr; }
        .sidebar { 
            position: static; 
            margin-bottom: var(--spacing-lg);
        }
        .filter-list { flex-direction: row; flex-wrap: wrap; }
        .filter-list li { padding: 0.75rem 1rem; }
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
