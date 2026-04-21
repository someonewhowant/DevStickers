import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductListComponent } from '../../features/product-list/product-list.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, ProductListComponent],
  template: `
    <app-hero></app-hero>
    <app-product-list></app-product-list>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent { }
