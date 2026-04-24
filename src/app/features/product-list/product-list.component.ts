import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCardComponent, FormsModule],
  template: `
    <section class="catalog-section">
        <div class="container catalog-container">
            <!-- Sidebar -->
            <aside class="sidebar" [class.open]="mobileFiltersOpen()">
                <div class="sidebar-header">
                    <h3>Filters</h3>
                    <button class="close-mobile-btn" (click)="toggleMobileFilters()">✕</button>
                </div>

                <div class="filter-group">
                    <h4>Categories</h4>
                    <div class="category-list">
                        <label class="filter-item">
                            <input type="radio" name="category" [checked]="selectedCategory() === 'All'" (change)="selectCategory('All')">
                            <span>All Stickers</span>
                        </label>
                        @for (category of categories(); track category) {
                            <label class="filter-item">
                                <input type="radio" name="category" [checked]="selectedCategory() === category" (change)="selectCategory(category)">
                                <span>{{ category }}</span>
                            </label>
                        }
                    </div>
                </div>

                <div class="filter-group">
                    <h4>Price Range</h4>
                    <div class="price-range">
                        <input type="range" [min]="minPrice()" [max]="maxPrice()" [ngModel]="priceFilter()" (ngModelChange)="onPriceChange($event)">
                        <div class="price-labels">
                            <span>$0</span>
                            <span>Up to {{ priceFilter() | currency }}</span>
                        </div>
                    </div>
                </div>

                <div class="sidebar-footer">
                    <button class="btn btn-outline full-width" (click)="resetFilters()">Reset All</button>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="main-content">
                <div class="catalog-toolbar">
                    <div class="toolbar-left">
                        <button class="mobile-filter-trigger" (click)="toggleMobileFilters()">
                            <span class="icon">🔍</span> Filters
                        </button>
                        <div class="search-bar">
                            <input 
                                type="text" 
                                [ngModel]="searchQuery()" 
                                (ngModelChange)="onSearchChange($event)"
                                placeholder="Search our collection...">
                        </div>
                    </div>

                    <div class="toolbar-right">
                        <div class="sort-box">
                            <label>Sort by:</label>
                            <select [ngModel]="sortBy()" (ngModelChange)="onSortChange($event)">
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Alphabetically: A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="results-header">
                    <p>{{ filteredProducts().length }} products found</p>
                </div>

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
                                (click)="prevPage()">← Prev</button>
                            
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
                                (click)="nextPage()">Next →</button>
                        </div>
                    }
                } @else {
                    <div class="no-results">
                        <div class="no-results-icon">🕵️‍♂️</div>
                        <h3>No matches found</h3>
                        <p>Try adjusting your filters or search terms.</p>
                        <button class="btn btn-primary" (click)="resetFilters()">Clear all filters</button>
                    </div>
                }
            </div>
        </div>
    </section>
  `,
  styles: [`
    .catalog-section {
        padding: var(--spacing-lg) 0;
        background: var(--bg-color);
    }

    .catalog-container {
        display: grid;
        grid-template-columns: var(--sidebar-width) 1fr;
        gap: var(--spacing-xl);
        max-width: var(--container-max-width);
        margin: 0 auto;
        padding: 0 var(--spacing-sm);
    }

    /* Sidebar Styles */
    .sidebar {
        position: sticky;
        top: calc(var(--header-height) + 2rem);
        height: fit-content;
    }

    .sidebar h3 {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 1rem;
    }

    .filter-group {
        margin-bottom: 2.5rem;
    }

    .filter-group h4 {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--text-secondary);
        margin-bottom: 1.25rem;
    }

    .category-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .filter-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        color: var(--text-primary);
        font-size: 0.95rem;
        transition: color 0.2s;
    }

    .filter-item:hover {
        color: var(--accent-blue);
    }

    .filter-item input {
        accent-color: var(--accent-blue);
        width: 18px;
        height: 18px;
    }

    .price-range {
        padding: 0 0.5rem;
    }

    .price-range input {
        width: 100%;
        accent-color: var(--accent-blue);
        margin-bottom: 1rem;
    }

    .price-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--text-secondary);
        font-family: 'JetBrains Mono', monospace;
    }

    .sidebar-footer {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    .full-width { width: 100%; }

    /* Main Content Styles */
    .catalog-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 1.5rem;
    }

    .toolbar-left {
        display: flex;
        gap: 1rem;
        flex: 1;
    }

    .search-bar {
        flex: 1;
        max-width: 400px;
    }

    .search-bar input {
        width: 100%;
        padding: 0.75rem 1.25rem;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        color: white;
        transition: all 0.3s;
    }

    .search-bar input:focus {
        border-color: var(--accent-blue);
        outline: none;
        box-shadow: var(--glow-blue);
    }

    .sort-box {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
    }

    .sort-box select {
        padding: 0.75rem 1rem;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        color: white;
        cursor: pointer;
    }

    .results-header {
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 2rem;
    }

    .pagination {
        margin-top: 4rem;
        display: flex;
        justify-content: center;
        gap: 2rem;
        align-items: center;
    }

    .mobile-filter-trigger, .close-mobile-btn {
        display: none;
    }

    @media (max-width: 1024px) {
        .catalog-container {
            grid-template-columns: 1fr;
        }

        .sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 300px;
            height: 100vh;
            background: var(--bg-color);
            z-index: 2000;
            padding: 2rem;
            transition: left 0.3s ease;
            box-shadow: 10px 0 30px rgba(0,0,0,0.5);
            overflow-y: auto;
        }

        .sidebar.open {
            left: 0;
        }

        .mobile-filter-trigger {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.25rem;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            color: white;
            cursor: pointer;
        }

        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .sidebar-header h3 { border: none; margin: 0; }

        .close-mobile-btn {
            display: block;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }

    @media (max-width: 640px) {
        .catalog-toolbar {
            flex-direction: column;
            align-items: stretch;
        }
        
        .toolbar-right {
            display: flex;
            justify-content: flex-end;
        }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  productService = inject(ProductService);

  // State
  searchQuery = signal('');
  selectedCategory = signal('All');
  priceFilter = signal(20);
  sortBy = signal('featured');
  currentPage = signal(1);
  pageSize = 9;
  mobileFiltersOpen = signal(false);

  // Computed
  minPrice = signal(0);
  maxPrice = signal(20);

  categories = computed(() => {
    const categories = this.productService.products().map(p => p.category);
    return Array.from(new Set(categories)).sort();
  });

  filteredProducts = computed(() => {
    let products = [...this.productService.products()].filter(p => {
      const query = this.searchQuery().toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(query) || 
                          p.category.toLowerCase().includes(query);
      const matchesCategory = this.selectedCategory() === 'All' || p.category === this.selectedCategory();
      const matchesPrice = p.price <= this.priceFilter();
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    switch (this.sortBy()) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  });

  paginatedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredProducts().length / this.pageSize));
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  // Actions
  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1);
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  onPriceChange(price: number) {
    this.priceFilter.set(price);
    this.currentPage.set(1);
  }

  onSortChange(sort: string) {
    this.sortBy.set(sort);
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('All');
    this.priceFilter.set(20);
    this.sortBy.set('featured');
    this.currentPage.set(1);
    this.mobileFiltersOpen.set(false);
  }

  toggleMobileFilters() {
    this.mobileFiltersOpen.update(v => !v);
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  prevPage() { if (this.currentPage() > 1) this.goToPage(this.currentPage() - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.goToPage(this.currentPage() + 1); }
}
