import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/cart.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container admin-page animate-in">
        <header class="admin-header">
            <div class="header-text">
                <h1>Dashboard</h1>
                <p class="subtitle">Manage sticker inventory and catalog</p>
            </div>
            <button class="btn btn-primary" (click)="showForm.set(true)">+ Create Sticker</button>
        </header>

        <!-- Product Form -->
        <div class="modal" *ngIf="showForm()">
            <div class="modal-content">
                <h3>{{ isEditing() ? 'Edit Product' : 'Add New Product' }}</h3>
                <form class="modal-form" (submit)="saveProduct($event)">
                    <div class="form-main">
                        <div class="form-row">
                            <div class="form-group flex-1">
                                <label>Product ID</label>
                                <input type="text" [(ngModel)]="currentProduct().id" name="id" [disabled]="isEditing()" placeholder="e.g. gopher-01" required>
                            </div>
                            <div class="form-group flex-1">
                                <label>Category Tag</label>
                                <input type="text" [(ngModel)]="currentProduct().tag" name="tag" placeholder="e.g. Go Lang" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Product Name</label>
                            <input type="text" [(ngModel)]="currentProduct().name" name="name" placeholder="Name of your sticker" required>
                        </div>
                        <div class="form-group">
                            <label>Price ($)</label>
                            <input type="number" [(ngModel)]="currentProduct().price" name="price" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Image Source</label>
                            <div class="source-tabs">
                                <button type="button" class="tab-btn" 
                                        [class.active]="imageSource() === 'asset'"
                                        (click)="imageSource.set('asset')">Local Assets</button>
                                <button type="button" class="tab-btn" 
                                        [class.active]="imageSource() === 'url'"
                                        (click)="imageSource.set('url')">External URL</button>
                            </div>
                        </div>

                        <div class="form-group" *ngIf="imageSource() === 'asset'">
                            <label>Quick Image Selection</label>
                            <div class="asset-gallery">
                                <div class="asset-item" *ngFor="let asset of availableAssets" 
                                     [class.selected]="currentProduct().image === asset"
                                     (click)="selectAsset(asset)">
                                    <img [src]="asset" [alt]="asset">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>{{ imageSource() === 'asset' ? 'Internal Path' : 'Image URL' }}</label>
                            <input type="text" [(ngModel)]="currentProduct().image" name="image" 
                                   [placeholder]="imageSource() === 'asset' ? '/assets/images/...' : 'https://...'" required>
                            <p class="input-hint" *ngIf="imageSource() === 'url' && !currentProduct().image.startsWith('http') && currentProduct().image">
                                ⚠️ URL should start with http:// or https://
                            </p>
                        </div>
                    </div>

                    <div class="form-preview">
                        <label>Live Preview</label>
                        <div class="preview-card" *ngIf="currentProduct().image">
                            <div class="preview-img-container">
                                <img [src]="currentProduct().image" alt="Preview">
                            </div>
                            <div class="preview-meta">
                                <strong>{{ currentProduct().name || 'Product Name' }}</strong>
                                <span>{{ currentProduct().tag || 'Category' }}</span>
                                <em class="price">{{ currentProduct().price | currency }}</em>
                            </div>
                        </div>
                        <div class="preview-placeholder" *ngIf="!currentProduct().image">
                            <span>Select an image to see preview</span>
                        </div>
                    </div>

                    <div class="form-footer">
                        <button type="button" class="btn btn-outline" (click)="cancel()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            {{ isEditing() ? 'Update Sticker' : 'Create Sticker' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="admin-actions-bar" *ngIf="productService.products().length > 0">
             <button class="btn btn-outline" (click)="resetToDefaults()">Reset to Defaults</button>
        </div>

        <!-- Product Table -->
        <div class="table-container">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th class="col-image">Image</th>
                        <th class="col-info">Product Details</th>
                        <th class="col-price">Price</th>
                        <th class="col-actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let p of productService.products()">
                        <td class="col-image">
                            <div class="table-img">
                                <img [src]="p.image" [alt]="p.name">
                            </div>
                        </td>
                        <td class="col-info">
                            <div class="info-content">
                                <span class="tag">{{ p.tag }}</span>
                                <div class="p-name">{{ p.name }}</div>
                                <div class="p-id">ID: #{{ p.id }}</div>
                            </div>
                        </td>
                        <td class="col-price">
                            <span class="price-val">{{ p.price | currency }}</span>
                        </td>
                        <td class="col-actions">
                            <div class="action-buttons">
                                <button class="btn-icon" (click)="editProduct(p)" title="Edit">✏️</button>
                                <button class="btn-icon" (click)="deleteProduct(p.id)" title="Delete">🗑️</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  `,
    styles: [`
    .admin-page { padding: var(--spacing-md) var(--spacing-sm); }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); }
    .subtitle { color: var(--text-secondary); font-size: 0.9rem; }
    
    .table-container { 
        background: var(--surface-color); 
        border-radius: 16px; 
        border: 1px solid var(--border-color);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        overflow: hidden;
    }
    
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
    .admin-table th { 
        background: rgba(255,255,255,0.02);
        padding: 1.25rem var(--spacing-md); 
        color: var(--text-secondary); 
        font-family: 'JetBrains Mono', monospace; 
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .admin-table td { padding: 1.25rem var(--spacing-md); border-bottom: 1px solid var(--border-color); }
    
    .table-img { width: 48px; height: 48px; background: var(--card-bg); border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .table-img img { max-width: 80%; }
    
    .info-content { display: flex; flex-direction: column; gap: 0.25rem; }
    .p-name { font-weight: 600; font-size: 1.1rem; }
    .p-id { font-size: 0.75rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; }
    
    .price-val { font-weight: 700; color: var(--accent-green); }
    
    .action-buttons { display: flex; gap: 0.5rem; }
    .btn-icon { 
        background: var(--card-bg); 
        border: 1px solid var(--border-color); 
        width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        border-radius: 8px; color: white; cursor: pointer; transition: all 0.2s;
    }
    .btn-icon:hover { border-color: var(--accent-blue); background: var(--border-color); transform: scale(1.1); }
    
    .modal {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center; z-index: 1000;
    }
    .modal-content {
        background: var(--bg-color); border: 1px solid var(--border-color);
        padding: var(--spacing-lg); border-radius: 20px; width: 800px; max-width: 95%;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        position: relative; overflow: hidden;
    }

    .modal-content::before {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
        background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
    }

    .modal-content h3 { margin-bottom: 2rem; font-size: 1.5rem; letter-spacing: -0.5px; }

    .modal-form { display: grid; grid-template-columns: 1fr 280px; gap: 2rem; }
    .form-main { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-footer { grid-column: span 2; display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
    
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }

    .form-group label { display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .form-group input { 
        width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color);
        padding: 0.75rem 1rem; border-radius: 10px; color: white; transition: all 0.2s;
        font-family: inherit;
    }
    .form-group input:focus { border-color: var(--accent-blue); outline: none; background: rgba(255,255,255,0.05); }

    .source-tabs { display: flex; gap: 0.5rem; background: var(--surface-color); padding: 0.25rem; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 0.5rem; }
    .tab-btn { flex: 1; padding: 0.5rem; border-radius: 8px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; font-size: 0.8rem; font-weight: 600; }
    .tab-btn.active { background: var(--accent-blue); color: white; box-shadow: var(--glow-blue); }

    .input-hint { font-size: 0.7rem; color: var(--accent-red); margin-top: 0.4rem; font-weight: 600; }

    .asset-gallery { display: flex; gap: 0.75rem; background: var(--surface-color); padding: 0.75rem; border-radius: 12px; border: 1px solid var(--border-color); overflow-x: auto; }
    .asset-item { 
        width: 60px; height: 60px; flex-shrink: 0; background: var(--card-bg); border-radius: 8px; 
        display: flex; align-items: center; justify-content: center; cursor: pointer;
        border: 2px solid transparent; transition: all 0.2s;
    }
    .asset-item:hover { transform: scale(1.05); border-color: var(--border-color); }
    .asset-item.selected { border-color: var(--accent-blue); background: rgba(88, 166, 255, 0.1); }
    .asset-item img { max-width: 70%; max-height: 70%; }

    .form-preview { background: var(--surface-color); padding: 1.5rem; border-radius: 16px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1rem; }
    .preview-card { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; animation: fadeInUp 0.3s ease; }
    .preview-img-container { padding: 1.5rem; background: var(--card-bg); display: flex; justify-content: center; align-items: center; aspect-ratio: 1; }
    .preview-img-container img { max-width: 80%; }
    .preview-meta { padding: 1rem; display: flex; flex-direction: column; gap: 0.25rem; border-top: 1px solid var(--border-color); }
    .preview-meta strong { font-size: 0.9rem; }
    .preview-meta span { font-size: 0.75rem; color: var(--text-secondary); }
    .preview-meta .price { font-style: normal; font-weight: 700; color: var(--accent-green); margin-top: 0.25rem; }

    .preview-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); font-size: 0.8rem; text-align: center; border: 1px dashed var(--border-color); border-radius: 12px; }

    .admin-actions-bar { margin-bottom: var(--spacing-md); display: flex; justify-content: flex-end; }
    .btn-outline { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); }
    .btn-outline:hover { border-color: var(--accent-blue); color: var(--text-primary); }
    
    @media (max-width: 850px) {
        .modal-content { width: 95%; height: 90vh; overflow-y: auto; }
        .modal-form { grid-template-columns: 1fr; }
        .form-preview { order: -1; }
    }
  `]
})
export class AdminComponent {
    productService = inject(ProductService);

    showForm = signal(false);
    isEditing = signal(false);
    imageSource = signal<'asset' | 'url'>('asset');
    currentProduct = signal<Product>({ id: '', name: '', price: 0, image: '', tag: '' });

    availableAssets = [
        '/assets/images/gopher.png',
        '/assets/images/ferris.png',
        '/assets/images/cat.png',
        '/assets/images/python.png',
        '/assets/images/js.png'
    ];

    selectAsset(path: string) {
        this.currentProduct.update(p => ({ ...p, image: path }));
    }

    editProduct(product: Product) {
        this.currentProduct.set({ ...product });
        this.isEditing.set(true);
        // Determine source based on path
        this.imageSource.set(product.image.startsWith('http') ? 'url' : 'asset');
        this.showForm.set(true);
    }

    deleteProduct(id: string) {
        if (confirm('Are you sure you want to delete this sticker?')) {
            this.productService.deleteProduct(id);
        }
    }

    saveProduct(event: Event) {
        event.preventDefault();
        if (this.isEditing()) {
            this.productService.updateProduct(this.currentProduct());
        } else {
            this.productService.addProduct(this.currentProduct());
        }
        this.cancel();
    }

    resetToDefaults() {
        if (confirm('Restoring defaults will delete all your custom stickers. Continue?')) {
            this.productService.resetToDefaults();
        }
    }

    cancel() {
        this.showForm.set(false);
        this.isEditing.set(false);
        this.currentProduct.set({ id: '', name: '', price: 0, image: '', tag: '' });
    }
}
