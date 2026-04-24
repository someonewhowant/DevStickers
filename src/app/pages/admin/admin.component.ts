import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { Product, Order } from '../../models/product.model';

@Component({
    selector: 'app-admin',
    imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
    template: `
    <div class="container admin-page animate-in">
        <header class="admin-header">
            <div class="header-text">
                <h1>Command Center</h1>
                <div class="tabs">
                    <button class="tab-btn" [class.active]="activeTab() === 'inventory'" (click)="activeTab.set('inventory')">Inventory</button>
                    <button class="tab-btn" [class.active]="activeTab() === 'orders'" (click)="activeTab.set('orders')">Orders</button>
                </div>
            </div>
            @if (activeTab() === 'inventory') {
                <button class="btn btn-primary" (click)="openCreateForm()">+ Create Sticker</button>
            }
        </header>

        @if (activeTab() === 'inventory') {
            <!-- Product Form Modal -->
            @if (showForm()) {
                <div class="modal">
                    <div class="modal-content">
                        <h3>{{ isEditing() ? 'Modify Asset' : 'New Asset Deployment' }}</h3>
                        <form [formGroup]="productForm" (ngSubmit)="saveProduct()" class="modal-form">
                            <div class="form-main">
                                <div class="form-row">
                                    <div class="form-group flex-1">
                                        <label>Serial ID</label>
                                        <input type="text" formControlName="id" placeholder="e.g. gopher-01">
                                    </div>
                                    <div class="form-group flex-1">
                                        <label>Sector Category</label>
                                        <input type="text" formControlName="category" placeholder="e.g. Go Lang">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Asset Name</label>
                                    <input type="text" formControlName="name" placeholder="Name of your sticker">
                                </div>
                                <div class="form-group">
                                    <label>Price (Credits)</label>
                                    <input type="number" formControlName="price">
                                </div>
                                
                                <div class="form-group">
                                    <label>Visual Interface (Image)</label>
                                    <div class="file-upload">
                                        <input type="file" (change)="onFileSelected($event)" accept="image/*" id="file-input">
                                        <label for="file-input" class="file-label">
                                            {{ selectedFile() ? selectedFile()?.name : 'Choose file or drag here' }}
                                        </label>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>Current/External URL</label>
                                    <input type="text" formControlName="imageUrl" placeholder="/assets/images/...">
                                </div>
                            </div>

                            <div class="form-preview">
                                <label>Asset Preview</label>
                                <div class="preview-card">
                                    @if (previewUrl()) {
                                        <img [src]="previewUrl()" alt="Preview">
                                    } @else if (productForm.get('imageUrl')?.value) {
                                        <img [src]="productForm.get('imageUrl')?.value" alt="Preview">
                                    } @else {
                                        <div class="placeholder">NO VISUAL DATA</div>
                                    }
                                </div>
                            </div>

                            <div class="form-footer">
                                <button type="button" class="btn btn-outline" (click)="cancel()">Abort</button>
                                <button type="submit" class="btn btn-primary" [disabled]="productForm.invalid || loading()">
                                    {{ isEditing() ? 'Update' : 'Deploy' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            <!-- Inventory Table -->
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Identity</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (p of productService.products(); track p.id) {
                            <tr>
                                <td><img [ngSrc]="p.imageUrl" width="40" height="40" class="table-thumb"></td>
                                <td>
                                    <div class="cell-main">{{ p.name }}</div>
                                    <div class="cell-sub">{{ p.category }} // #{{ p.id }}</div>
                                </td>
                                <td class="price-cell">{{ p.price | currency }}</td>
                                <td>
                                    <div class="action-row">
                                        <button class="btn-icon" (click)="editProduct(p)">✏️</button>
                                        <button class="btn-icon delete" (click)="deleteProduct(p.id)">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        } @else {
            <!-- Orders Management -->
            <div class="table-container">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Operator</th>
                            <th>Status</th>
                            <th>Credits</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @for (order of adminOrders(); track order.id) {
                            <tr>
                                <td class="mono">#{{ order.id.split('-')[0] }}</td>
                                <td>{{ getUserEmail(order) }}</td>
                                <td>
                                    <select [value]="order.status" (change)="updateOrderStatus(order.id, \$any(\$event.target).value)" class="status-select" [class]="order.status.toLowerCase()">
                                        <option value="PENDING">PENDING</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </select>
                                </td>
                                <td class="price-cell">{{ order.total | currency }}</td>
                                <td><button class="btn-text" (click)="viewOrderDetails(order)">Details</button></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        }
    </div>
  `,
  styles: [`
    .admin-page { padding: var(--spacing-lg) var(--spacing-md); }
    .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--spacing-xl); }
    
    .tabs { display: flex; gap: 1rem; margin-top: 1rem; }
    .tab-btn { background: none; border: none; color: var(--text-secondary); font-size: 1.1rem; font-weight: 700; cursor: pointer; padding: 0.5rem 0; border-bottom: 2px solid transparent; transition: all 0.3s; }
    .tab-btn.active { color: var(--accent-blue); border-bottom-color: var(--accent-blue); }

    .table-container { background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
    .admin-table th { background: rgba(255,255,255,0.02); padding: 1.2rem; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); }
    .admin-table td { padding: 1.2rem; border-bottom: 1px solid var(--border-color); }
    
    .table-thumb { border-radius: 8px; background: var(--card-bg); }
    .cell-main { font-weight: 700; margin-bottom: 0.2rem; }
    .cell-sub { font-size: 0.75rem; color: var(--text-secondary); font-family: 'JetBrains Mono', monospace; }
    .price-cell { color: var(--accent-green); font-weight: 700; }
    .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }

    .status-select { 
        background: var(--card-bg); color: white; border: 1px solid var(--border-color); 
        padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.8rem; font-weight: 700;
        cursor: pointer;
    }
    .status-select.pending { color: var(--accent-red); border-color: var(--accent-red); }
    .status-select.completed { color: var(--accent-green); border-color: var(--accent-green); }

    .file-upload { position: relative; margin-top: 0.5rem; }
    .file-upload input { position: absolute; width: 0; height: 0; opacity: 0; }
    .file-label { display: block; padding: 1.5rem; border: 2px dashed var(--border-color); border-radius: 12px; text-align: center; cursor: pointer; transition: all 0.3s; color: var(--text-secondary); font-size: 0.85rem; }
    .file-label:hover { border-color: var(--accent-blue); background: rgba(88, 166, 255, 0.05); }

    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
    .modal-content { background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 32px; padding: var(--spacing-lg); width: 850px; max-width: 95%; position: relative; }
    .modal-form { display: grid; grid-template-columns: 1fr 280px; gap: 2.5rem; }
    
    .form-group label { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.6rem; font-weight: 700; }
    .form-group input { width: 100%; background: var(--card-bg); border: 1px solid var(--border-color); padding: 0.9rem 1.2rem; border-radius: 12px; color: white; }
    
    .preview-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .preview-card img { max-width: 80%; max-height: 80%; object-fit: contain; }
    .placeholder { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; opacity: 0.3; }

    .action-row { display: flex; gap: 0.5rem; }
    .btn-icon { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 10px; width: 38px; height: 38px; cursor: pointer; transition: all 0.2s; }
    .btn-icon:hover { border-color: var(--accent-blue); transform: translateY(-2px); }
    .btn-icon.delete:hover { border-color: var(--accent-red); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
    private fb = inject(FormBuilder);
    productService = inject(ProductService);
    private orderService = inject(OrderService);

    activeTab = signal<'inventory' | 'orders'>('inventory');
    showForm = signal(false);
    isEditing = signal(false);
    loading = signal(false);
    
    adminOrders = signal<Order[]>([]);
    selectedFile = signal<File | null>(null);
    previewUrl = signal<string | null>(null);

    productForm: FormGroup = this.fb.group({
        id: ['', Validators.required],
        name: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        imageUrl: [''],
        category: ['', Validators.required]
    });

    constructor() {
        this.loadAdminOrders();
    }

    loadAdminOrders() {
        this.orderService.getAllOrders().subscribe(orders => {
            this.adminOrders.set(orders);
        });
    }

    getUserEmail(order: Order): string {
        return (order as any).user?.email || 'Guest';
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile.set(file);
            const reader = new FileReader();
            reader.onload = () => this.previewUrl.set(reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    openCreateForm() {
        this.isEditing.set(false);
        this.productForm.reset({ price: 0 });
        this.selectedFile.set(null);
        this.previewUrl.set(null);
        this.showForm.set(true);
    }

    editProduct(product: Product) {
        this.isEditing.set(true);
        this.productForm.patchValue(product);
        this.selectedFile.set(null);
        this.previewUrl.set(null);
        this.showForm.set(true);
    }

    saveProduct() {
        if (this.productForm.invalid) return;
        this.loading.set(true);

        const obs = this.isEditing() 
            ? this.productService.updateProduct(this.productForm.getRawValue().id, this.productForm.getRawValue(), this.selectedFile() || undefined)
            : this.productService.addProduct(this.productForm.getRawValue(), this.selectedFile() || undefined);

        obs.subscribe({
            next: () => {
                this.loading.set(false);
                this.cancel();
            },
            error: () => this.loading.set(false)
        });
    }

    updateOrderStatus(orderId: string, status: string) {
        this.orderService.updateStatus(orderId, status).subscribe(() => {
            this.loadAdminOrders();
        });
    }

    deleteProduct(id: string) {
        if (confirm('Decommission this asset?')) {
            this.productService.deleteProduct(id).subscribe();
        }
    }

    viewOrderDetails(order: Order) {
        // Implementation for order details modal could go here
        alert(`Order ${order.id} contains ${order.items.length} items.`);
    }

    cancel() {
        this.showForm.set(false);
        this.selectedFile.set(null);
        this.previewUrl.set(null);
        this.productForm.reset();
    }
}
