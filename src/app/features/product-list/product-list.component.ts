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
            <aside class="sidebar glass-panel" [class.open]="mobileFiltersOpen()">
                <div class="sidebar-header">
                    <h3>Filters</h3>
                    <button class="close-mobile-btn" (click)="toggleMobileFilters()">✕</button>
                </div>

                <div class="filter-group">
                    <h4>Categories</h4>
                    <div class="category-list">
                        <label class="filter-item">
                            <input type="radio" name="category" [checked]="selectedCategory() === 'All'" (change)="selectCategory('All')">
                            <span class="filter-label">All Stickers</span>
                        </label>
                        @for (category of categories(); track category) {
                            <label class="filter-item">
                                <input type="radio" name="category" [checked]="selectedCategory() === category" (change)="selectCategory(category)">
                                <span class="filter-label">{{ category }}</span>
                            </label>
                        }
                    </div>
                </div>

                <div class="filter-group">
                    <h4>Price Range</h4>
                    <div class="price-range">
                        <input type="range" class="custom-range" [min]="minPrice()" [max]="maxPrice()" [ngModel]="priceFilter()" (ngModelChange)="onPriceChange($event)">
                        <div class="price-labels">
                            <span>$0</span>
                            <span class="current-price">Up to {{ priceFilter() | currency }}</span>
                        </div>
                    </div>
                </div>

                <div class="sidebar-footer">
                    <button class="btn btn-outline full-width" (click)="resetFilters()">Reset All</button>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="main-content">
                <div class="catalog-toolbar glass-panel">
                    <div class="toolbar-left">
                        <button class="mobile-filter-trigger" (click)="toggleMobileFilters()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="8" x2="14" y2="8"></line><line x1="18" y1="16" x2="22" y2="16"></line></svg>
                            Filters
                        </button>
                        <div class="search-bar">
                            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input 
                                type="text" 
                                [ngModel]="searchQuery()" 
                                (ngModelChange)="onSearchChange($event)"
                                placeholder="Search stickers...">
                        </div>
                    </div>

                    <div class="toolbar-right">
                        <div class="sort-box">
                            <label>Sort by:</label>
                            <div class="select-wrapper">
                                <select [ngModel]="sortBy()" (ngModelChange)="onSortChange($event)">
                                    <option value="featured">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name-asc">Alphabetically: A-Z</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="results-info">
                    <p class="results-count">Showing <span>{{ filteredProducts().length }}</span> stickers</p>
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
                                (click)="prevPage()">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            </button>
                            
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
                                (click)="nextPage()">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        </div>
                    }
                } @else {
                    <div class="no-results glass-panel animate-in">
                        <div class="no-results-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                        </div>
                        <h3>No stickers found</h3>
                        <p>We couldn't find any stickers matching your current filters.</p>
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
        padding: 2rem;
    }

    .sidebar h3 {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        color: #fff;
    }

    .filter-group {
        margin-bottom: 2.5rem;
    }

    .filter-group h4 {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--accent-blue);
        margin-bottom: 1.5rem;
        font-weight: 700;
    }

    .category-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .filter-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 0.95rem;
        transition: all 0.2s;
    }

    .filter-item:hover {
        color: #fff;
    }

    .filter-item input {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        background: rgba(255,255,255,0.05);
        cursor: pointer;
        position: relative;
        transition: all 0.2s;
    }

    .filter-item input:checked {
        background: var(--accent-blue);
        border-color: var(--accent-blue);
        box-shadow: 0 0 10px rgba(var(--accent-blue-rgb), 0.4);
    }

    .filter-item input:checked::after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 12px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .price-range {
        padding: 0 0.25rem;
    }

    .custom-range {
        width: 100%;
        accent-color: var(--accent-blue);
        height: 4px;
        background: var(--border-color);
        border-radius: 2px;
        margin-bottom: 1.5rem;
    }

    .price-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-secondary);
    }

    .current-price {
        color: var(--accent-cyan);
    }

    .sidebar-footer {
        margin-top: 1rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }

    /* Toolbar Styles */
    .catalog-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
    }

    .toolbar-left {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        flex: 1;
    }

    .search-bar {
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
        pointer-events: none;
    }

    .search-bar input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        background: rgba(255,255,255,0.03);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        color: white;
        font-size: 0.9rem;
        transition: all 0.3s;
    }

    .search-bar input:focus {
        border-color: var(--accent-blue);
        background: rgba(255,255,255,0.06);
        box-shadow: 0 0 15px rgba(var(--accent-blue-rgb), 0.15);
        outline: none;
    }

    .sort-box {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.85rem;
        color: var(--text-secondary);
        font-weight: 600;
    }

    .select-wrapper {
        position: relative;
    }

    .sort-box select {
        appearance: none;
        padding: 0.6rem 2.5rem 0.6rem 1rem;
        background: rgba(255,255,255,0.05);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
    }

    .results-info {
        margin-bottom: 2rem;
    }

    .results-count {
        font-size: 0.95rem;
        color: var(--text-secondary);
    }

    .results-count span {
        color: #fff;
        font-weight: 700;
    }

    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2.5rem;
    }

    /* Pagination Styles */
    .pagination {
        margin-top: 5rem;
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        align-items: center;
    }

    .page-numbers {
        display: flex;
        gap: 0.5rem;
    }

    .page-num {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        background: transparent;
        color: var(--text-secondary);
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s;
    }

    .page-num:hover, .page-num.active {
        background: var(--accent-blue);
        border-color: var(--accent-blue);
        color: white;
        box-shadow: 0 0 15px rgba(var(--accent-blue-rgb), 0.3);
    }

    .btn-nav {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        background: rgba(255,255,255,0.03);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
    }

    .btn-nav:hover:not(:disabled) {
        border-color: var(--text-secondary);
        background: rgba(255,255,255,0.08);
    }

    .btn-nav:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .no-results {
        padding: 5rem 2rem;
        text-align: center;
        border-radius: 20px;
    }

    .no-results-icon {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        opacity: 0.5;
    }

    .mobile-filter-trigger { display: none; }

    @media (max-width: 1024px) {
        .catalog-container { grid-template-columns: 1fr; }
        .sidebar {
            position: fixed;
            top: 0;
            left: -100%;
            width: 300px;
            height: 100vh;
            background: var(--bg-color);
            z-index: 2000;
            transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 20px 0 60px rgba(0,0,0,0.8);
            border-radius: 0;
            border-top: none;
            border-bottom: none;
            border-left: none;
        }
        .sidebar.open { left: 0; }
        .mobile-filter-trigger {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1.25rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            color: white;
            font-weight: 600;
            cursor: pointer;
        }
        .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3rem;
        }
        .close-mobile-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }

    @media (max-width: 640px) {
        .catalog-toolbar { flex-direction: column; align-items: stretch; height: auto; gap: 1.5rem; padding: 1.5rem; }
        .toolbar-left { flex-direction: column; align-items: stretch; }
        .search-bar { max-width: none; }
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
