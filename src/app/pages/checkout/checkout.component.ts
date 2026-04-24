import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container checkout-page animate-in">
      <h1>Finalize Deployment</h1>
      
      <div class="checkout-layout">
        <!-- Form Section -->
        <div class="form-section">
          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="cyber-form">
            <section class="form-block">
              <h3><span class="step-num">01</span> Shipping Coordinates</h3>
              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Street Address</label>
                  <input type="text" formControlName="street" placeholder="e.g. 123 Matrix Ave">
                </div>
                <div class="form-group">
                  <label>City / Sector</label>
                  <input type="text" formControlName="city" placeholder="Zion">
                </div>
                <div class="form-group">
                  <label>Zip / Data Code</label>
                  <input type="text" formControlName="zip" placeholder="10101">
                </div>
              </div>
            </section>

            <section class="form-block">
              <h3><span class="step-num">02</span> Payment Protocol</h3>
              <div class="payment-options">
                <label class="payment-card" [class.selected]="checkoutForm.get('paymentMethod')?.value === 'card'">
                  <input type="radio" formControlName="paymentMethod" value="card">
                  <span class="icon">💳</span>
                  <span class="label">Neural Card</span>
                </label>
                <label class="payment-card" [class.selected]="checkoutForm.get('paymentMethod')?.value === 'cash'">
                  <input type="radio" formControlName="paymentMethod" value="cash">
                  <span class="icon">💵</span>
                  <span class="label">Credits on Arrival</span>
                </label>
              </div>
            </section>

            <section class="form-block">
              <h3><span class="step-num">03</span> Promo Override</h3>
              <div class="promo-input">
                <input type="text" formControlName="promoCode" placeholder="Enter code (e.g. SAVE10)">
                <button type="button" class="btn btn-outline" (click)="applyPromo()">Apply</button>
              </div>
              @if (promoApplied()) {
                <p class="promo-success">✓ 10% discount authorized</p>
              }
            </section>

            <div class="form-footer">
              <a routerLink="/cart" class="btn-text">← Return to Inventory</a>
            </div>
          </form>
        </div>

        <!-- Summary Section -->
        <aside class="summary-section">
          <div class="summary-card">
            <h3>Mission Summary</h3>
            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>{{ cartService.subtotal() | currency }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span class="free">FREE</span>
              </div>
              @if (promoApplied()) {
                <div class="summary-row discount">
                  <span>Promo Discount:</span>
                  <span>-{{ (cartService.subtotal() * 0.1) | currency }}</span>
                </div>
              }
            </div>
            <hr>
            <div class="summary-row total">
              <span>Total Credits:</span>
              <span class="total-val">{{ total() | currency }}</span>
            </div>

            <button 
              class="btn btn-primary checkout-btn" 
              (click)="onSubmit()"
              [disabled]="checkoutForm.invalid || loading() || cartService.cartCount() === 0">
              @if (loading()) {
                <span class="loader"></span> Processing...
              } @else {
                Execute Transaction
              }
            </button>
            <p class="security-note">Encrypted end-to-end connection</p>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { padding: var(--spacing-lg) var(--spacing-md); }
    .checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: var(--spacing-xl); margin-top: var(--spacing-lg); }
    
    .form-block { background: var(--surface-color); padding: 2rem; border-radius: 20px; border: 1px solid var(--border-color); margin-bottom: 2rem; }
    .step-num { color: var(--accent-blue); font-family: 'JetBrains Mono', monospace; margin-right: 1rem; opacity: 0.5; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; }
    .full-width { grid-column: span 2; }
    
    .form-group label { display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 600; }
    .form-group input { width: 100%; background: var(--card-bg); border: 1px solid var(--border-color); padding: 0.8rem 1rem; border-radius: 10px; color: white; }
    .form-group input:focus { border-color: var(--accent-blue); outline: none; }

    .payment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
    .payment-card { 
      border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 16px; 
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; transition: all 0.2s;
    }
    .payment-card input { display: none; }
    .payment-card.selected { border-color: var(--accent-blue); background: rgba(88, 166, 255, 0.05); box-shadow: var(--glow-blue); }
    .payment-card .icon { font-size: 1.5rem; }
    .payment-card .label { font-size: 0.8rem; font-weight: 600; }

    .promo-input { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .promo-input input { flex: 1; background: var(--card-bg); border: 1px solid var(--border-color); padding: 0.7rem 1rem; border-radius: 10px; color: white; }
    .promo-success { color: var(--accent-green); font-size: 0.8rem; margin-top: 0.5rem; font-weight: 600; }

    .summary-card { background: var(--surface-color); padding: 2rem; border-radius: 24px; border: 1px solid var(--border-color); position: sticky; top: 100px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 1rem; color: var(--text-secondary); }
    .summary-row.discount { color: var(--accent-green); }
    .summary-row.total { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); color: var(--text-primary); font-weight: 800; font-size: 1.25rem; }
    .total-val { color: var(--accent-green); }

    .checkout-btn { width: 100%; padding: 1.2rem; border-radius: 12px; margin-top: 1.5rem; font-size: 1.1rem; }
    .security-note { text-align: center; font-size: 0.7rem; color: var(--text-secondary); margin-top: 1rem; }

    .loader { width: 18px; height: 18px; border: 2px solid #FFF; border-bottom-color: transparent; border-radius: 50%; display: inline-block; animation: rotation 1s linear infinite; margin-right: 10px; }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    @media (max-width: 900px) {
      .checkout-layout { grid-template-columns: 1fr; }
      .summary-section { order: -1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  loading = signal(false);
  promoApplied = signal(false);

  checkoutForm: FormGroup = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
    paymentMethod: ['card', Validators.required],
    promoCode: ['']
  });

  total = computed(() => {
    const sub = this.cartService.subtotal();
    return this.promoApplied() ? sub * 0.9 : sub;
  });

  applyPromo() {
    if (this.checkoutForm.get('promoCode')?.value === 'SAVE10') {
      this.promoApplied.set(true);
    }
  }

  onSubmit() {
    if (this.checkoutForm.invalid || this.loading()) return;

    this.loading.set(true);
    const formValue = this.checkoutForm.value;
    
    const orderData = {
      shippingAddress: `${formValue.street}, ${formValue.city}, ${formValue.zip}`,
      paymentMethod: formValue.paymentMethod,
      promoCode: this.promoApplied() ? 'SAVE10' : ''
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-success', order.id]);
      },
      error: (err) => {
        this.loading.set(false);
        alert('Transmission failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
