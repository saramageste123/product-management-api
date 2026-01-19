import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  loading = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
  this.loading = true;

  this.productService.getProductsPaged().subscribe({
    next: (response) => {
      console.log('API RESPONSE:', response);

      this.products = response.products ?? [];
      this.loading = false;

      console.log('LOADING AFTER RESPONSE:', this.loading);
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = 'Erro ao carregar produtos';
      this.loading = false;

      console.log('LOADING AFTER ERROR:', this.loading);
    }
  });
}
}
