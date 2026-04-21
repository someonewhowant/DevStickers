import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
    selector: 'app-admin',
    imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
    template: `
    <div class="container admin-page animate-in">
        <header class="admin-header">
            <div class="header-text">
                <h1>Dashboard</h1>
                <p class="subtitle">Manage sticker inventory and catalog</p>
            </div>
            <button class="btn btn-primary" (click)="openCreateForm()">+ Create Sticker</button>
        </header>

        <!-- Product Form -->
        @if (showForm()) {
            <div class="modal">
                <div class="modal-content">
                    <h3>{{ isEditing() ? 'Edit Product' : 'Add New Product' }}</h3>
                    <form class="modal-form" [formGroup]="productForm" (ngSubmit)="saveProduct()">
                        <div class="form-main">
                            <div class="form-row">
                                <div class="form-group flex-1">
                                    <label>Product ID</label>
                                    <input type="text" formControlName="id" placeholder="e.g. gopher-01">
                                </div>
                                <div class="form-group flex-1">
                                    <label>Category Tag</label>
                                    <input type="text" formControlName="tag" placeholder="e.g. Go Lang">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Product Name</label>
                                <input type="text" formControlName="name" placeholder="Name of your sticker">
                            </div>
                            <div class="form-group">
                                <label>Price ($)</label>
                                <input type="number" formControlName="price">
                            </div>
                            
                            <div class="form-group">
                                <label>Image Source</label>
                                <div class="source-tabs">
                                    <button type="button" class="tab-btn" 
                                            [class.active]="imageSource() === 'asset'"
                                            (click)="setImageSource('asset')">Local Assets</button>
                                    <button type="button" class="tab-btn" 
                                            [class.active]="imageSource() === 'url'"
                                            (click)="setImageSource('url')">External URL</button>
                                </div>
                            </div>

                            @if (imageSource() === 'asset') {
                                <div class="form-group">
                                    <label>Quick Image Selection</label>
                                    <div class="asset-gallery">
                                        @for (asset of availableAssets; track asset) {
                                            <div class="asset-item" 
                                                 [class.selected]="productForm.get('image')?.value === asset"
                                                 (click)="selectAsset(asset)">
                                                <img [src]="asset" [alt]="asset">
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                            <div class="form-group">
                                <label>{{ imageSource() === 'asset' ? 'Internal Path' : 'Image URL' }}</label>
                                <input type="text" formControlName="image" 
                                       [placeholder]="imageSource() === 'asset' ? '/assets/images/...' : 'https://...'">
                                @if (imageSource() === 'url' && productForm.get('image')?.value && !productForm.get('image')?.value?.startsWith('http')) {
                                    <p class="input-hint">
                                        ⚠️ URL should start with http:// or https://
                                    </p>
                                }
                            </div>
                        </div>

                        <div class="form-preview">
                            <label>Live Preview</label>
                            @if (productForm.get('image')?.value) {
                                <div class="preview-card">
                                    <div class="preview-img-container">
                                        <img [src]="productForm.get('image')?.value" alt="Preview">
                                    </div>
                                    <div class="preview-meta">
                                        <strong>{{ productForm.get('name')?.value || 'Product Name' }}</strong>
                                        <span>{{ productForm.get('tag')?.value || 'Category' }}</span>
                                        <em class="price">{{ productForm.get('price')?.value | currency }}</em>
                                    </div>
                                </div>
                            } @else {
                                <div class="preview-placeholder">
                                    <span>Select an image to see preview</span>
                                </div>
                            }
                        </div>

                        <div class="form-footer">
                            <button type="button" class="btn btn-outline" (click)="cancel()">Cancel</button>
                            <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid">
                                {{ isEditing() ? 'Update Sticker' : 'Create Sticker' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        }

        @if (productService.products().length > 0) {
            <div class="admin-actions-bar">
                 <button class="btn btn-outline" (click)="resetToDefaults()">Reset to Defaults</button>
            </div>
        }

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
                    @for (p of productService.products(); track p.id) {
                        <tr>
                            <td class="col-image">
                                <div class="table-img">
                                    <img [ngSrc]="p.image" [alt]="p.name" width="40" height="40">
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
                    }
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
    .table-img img { max-width: 80%; height: auto; }
    
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
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
    private fb = inject(FormBuilder);
    productService = inject(ProductService);

    showForm = signal(false);
    isEditing = signal(false);
    imageSource = signal<'asset' | 'url'>('asset');
    
    productForm: FormGroup = this.fb.group({
        id: ['', Validators.required],
        name: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        image: ['', Validators.required],
        tag: ['', Validators.required]
    });

    availableAssets = [
        '/assets/images/gopher.png',
        '/assets/images/ferris.png',
        '/assets/images/cat.png',
        '/assets/images/python.png',
        '/assets/images/js.png'
    ];

    openCreateForm() {
        this.isEditing.set(false);
        this.productForm.reset({ price: 0 });
        this.productForm.get('id')?.enable();
        this.showForm.set(true);
    }

    setImageSource(source: 'asset' | 'url') {
        this.imageSource.set(source);
    }

    selectAsset(path: string) {
        this.productForm.patchValue({ image: path });
    }

    editProduct(product: Product) {
        this.isEditing.set(true);
        this.productForm.setValue({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            tag: product.tag
        });
        this.productForm.get('id')?.disable();
        this.imageSource.set(product.image.startsWith('http') ? 'url' : 'asset');
        this.showForm.set(true);
    }

    deleteProduct(id: string) {
        if (confirm('Are you sure you want to delete this sticker?')) {
            this.productService.deleteProduct(id);
        }
    }

    saveProduct() {
        if (this.productForm.invalid) return;

        const productData = this.productForm.getRawValue() as Product;

        if (this.isEditing()) {
            this.productService.updateProduct(productData);
        } else {
            this.productService.addProduct(productData);
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
        this.productForm.reset();
    }
}
