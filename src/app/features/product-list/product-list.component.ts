import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCardComponent, FormsModule],
  template: `
    <section class="products">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Available Stickers</h2>
                <p class="section-subtitle">Choose your favorite stickers to customize your gear</p>
            </div>

            <!-- Search and Filter Bar -->
            <div class="controls-bar">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input 
                        type="text" 
                        [ngModel]="searchQuery()" 
                        (ngModelChange)="onSearchChange($event)"
                        placeholder="Search stickers by name or category...">
                </div>
                
                <div class="filter-pills">
                    <button 
                        class="pill" 
                        [class.active]="selectedCategory() === 'All'"
                        (click)="selectCategory('All')">All</button>
                    @for (category of categories(); track category) {
                        <button 
                            class="pill" 
                            [class.active]="selectedCategory() === category"
                            (click)="selectCategory(category)">{{ category }}</button>
                    }
                </div>
            </div>

            <!-- Results Info -->
            <div class="results-info">
                <span>Showing {{ filteredProducts().length }} stickers</span>
                @if (searchQuery() || selectedCategory() !== 'All') {
                    <button class="btn-text" (click)="resetFilters()">Clear Filters</button>
                }
            </div>

            <!-- Product Grid -->
            @if (paginatedProducts().length > 0) {
                <div class="product-grid">
                    @for (product of paginatedProducts(); track product.id) {
                        <app-product-card [product]="product"></app-product-card>
                    }
                </div>

                <!-- Pagination -->
                @if (totalPages() > 1) {
                    <div class="pagination">
                        <button 
                            class="btn-nav" 
                            [disabled]="currentPage() === 1"
                            (click)="prevPage()">Previous</button>
                        
                        <div class="page-numbers">
                            @for (page of pageNumbers(); track page) {
                                <button 
                                    class="page-num" 
                                    [class.active]="currentPage() === page"
                                    (click)="goToPage(page)">{{ page }}</button>
                            }
                        </div>

                        <button 
                            class="btn-nav" 
                            [disabled]="currentPage() === totalPages()"
                            (click)="nextPage()">Next</button>
                    </div>
                }
            } @else {
                <div class="no-results">
                    <div class="no-results-icon">😵‍💫</div>
                    <h3>No stickers found</h3>
                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                    <button class="btn btn-primary" (click)="resetFilters()">Reset All Filters</button>
                </div>
            }
        </div>
    </section>
  `,
  styles: [`
    .section-header {
        text-align: center;
        margin-bottom: var(--spacing-lg);
    }
    .section-title {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .section-subtitle {
        color: var(--text-secondary);
        font-size: 1.1rem;
    }

    .controls-bar {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: var(--spacing-md);
        background: var(--surface-color);
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid var(--border-color);
    }

    @media (min-width: 768px) {
        .controls-bar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }
    }

    .search-box {
        position: relative;
        flex: 1;
        max-width: 400px;
    }

    .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }

    .search-box input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        color: white;
        font-family: inherit;
        transition: all 0.3s ease;
    }

    .search-box input:focus {
        outline: none;
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.2);
    }

    .filter-pills {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .pill {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .pill:hover {
        border-color: var(--text-secondary);
        color: var(--text-primary);
    }

    .pill.active {
        background: var(--accent-blue);
        border-color: var(--accent-blue);
        color: white;
        box-shadow: var(--glow-blue);
    }

    .results-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .btn-text {
        background: none;
        border: none;
        color: var(--accent-blue);
        cursor: pointer;
        font-weight: 600;
        padding: 0;
    }

    .btn-text:hover {
        text-decoration: underline;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--spacing-md);
        padding-bottom: var(--spacing-lg);
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5rem;
        margin-top: var(--spacing-md);
        padding: var(--spacing-md) 0;
    }

    .page-numbers {
        display: flex;
        gap: 0.5rem;
    }

    .page-num {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
    }

    .page-num:hover {
        border-color: var(--accent-blue);
        color: var(--text-primary);
    }

    .page-num.active {
        background: var(--accent-blue);
        border-color: var(--accent-blue);
        color: white;
    }

    .btn-nav {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
    }

    .btn-nav:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-nav:not(:disabled):hover {
        border-color: var(--accent-blue);
        background: var(--card-bg);
    }

    .no-results {
        text-align: center;
        padding: var(--spacing-xl) 0;
        background: var(--surface-color);
        border-radius: 20px;
        border: 1px dashed var(--border-color);
    }

    .no-results-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .no-results h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .no-results p {
        color: var(--text-secondary);
        margin-bottom: 2rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  productService = inject(ProductService);

  // State
  searchQuery = signal('');
  selectedCategory = signal('All');
  currentPage = signal(1);
  pageSize = 8;

  // Computed
  categories = computed(() => {
    const tags = this.productService.products().map(p => p.tag);
    return Array.from(new Set(tags)).sort();
  });

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    
    return this.productService.products().filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(query) || 
                          p.tag.toLowerCase().includes(query) ||
                          p.description.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || p.tag === category;
      return matchesSearch && matchesCategory;
    });
  });

  paginatedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize));

  pageNumbers = computed(() => {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  });

  // Actions
  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page on search
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1); // Reset to first page on filter change
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.goToPage(this.currentPage() + 1);
    }
  }
}
