import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProductListComponent } from '../../features/product-list/product-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, ProductListComponent],
  template: `
    <app-hero></app-hero>
    <app-product-list></app-product-list>
  `,
  styles: []
})
export class HomeComponent { }
