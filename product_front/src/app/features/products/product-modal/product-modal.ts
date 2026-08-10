import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.model';
import { ProductStatus } from '../enums/product-status.enum';
import { ProductCategory } from '../enums/product-category.enum';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css',
})
export class ProductModalComponent implements OnChanges {

  @Input() isDetailsOpen = false;
  @Input() editableProduct!: Product | null;
  @Input() isEditMode = false;
  @Input() triedSave = false;
  @Input() mode: 'view' | 'edit' | 'create' = 'view';
  @Input() imageError = '';
  @Input() showDiscountInfo = false;
  @Input() isCategoryOpen = false;
  @Output() enableEdit = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<any>();
  @Output() toggleDiscountInfo = new EventEmitter<void>();
  @Output() selectCategory = new EventEmitter<ProductCategory>(); 
  @Output() toggleCategoryDropdown = new EventEmitter<void>();
  @Output() deleteProductClick  = new EventEmitter<void>();
  @Output() removeImage = new EventEmitter<void>();
  @Output() imageSelected = new EventEmitter<Event>();
  @Output() closeAttempt = new EventEmitter<void>();

  ProductStatus = ProductStatus;
  ProductCategory = ProductCategory;

  private priceCents = 0;
  priceDisplay = '0,00';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editableProduct']) {
      const price = this.editableProduct?.originalPrice ?? this.editableProduct?.price ?? 0;
      this.priceCents = Math.round(price * 100);
      this.priceDisplay = this.formatFromCents(this.priceCents);
    }
  }
  
  isCodeInvalid(): boolean {
    const code = this.editableProduct?.code;
    if (!code) return false;

    const regex = /^\d{8,20}$/;
    return !regex.test(code);
  }

  onPriceKeydown(event: KeyboardEvent): void {

    if (event.key >= '0' && event.key <= '9') {
      event.preventDefault();

      const nextValue = this.priceCents * 10 + Number(event.key);

      // Safety limit
      if (nextValue <= 99999999999) {
        this.priceCents = nextValue;
        this.applyPriceChange();
      }
      return;
    }

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.priceCents = Math.floor(this.priceCents / 10);
      this.applyPriceChange();
      return;
    }

    const allowedKeys = ['Tab', 'Shift', 'Escape', 'Enter'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onPricePaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  onPriceFocus(input: HTMLInputElement): void {
    setTimeout(() => {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    });
  }

  private formatFromCents(cents: number): string {
    const value = cents / 100;
    return value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private applyPriceChange(): void {
    const value = this.priceCents / 100;
    this.priceDisplay = this.formatFromCents(this.priceCents);

    if (this.editableProduct) {
      this.editableProduct.price = value;
    }
  }

}