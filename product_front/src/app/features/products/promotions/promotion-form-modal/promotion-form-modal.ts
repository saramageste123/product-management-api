import { Component, input, output, signal, computed, OnInit, inject, HostListener, ElementRef } from '@angular/core';

import { DropdownSelectComponent, DropdownOption } from '../dropdown-select/dropdown-select';
import { DateFieldComponent } from '../date-field/date-field';

import { PromotionCreateRequest, PromotionTargetType } from '../../models/promotion-create.model';
import { ProductCategory } from '../../enums/product-category.enum';

import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-promotion-form-modal',
  standalone: true,
  imports: [DropdownSelectComponent, DateFieldComponent],
  templateUrl: './promotion-form-modal.html',
  styleUrl: './promotion-form-modal.css'
})
export class PromotionFormModalComponent implements OnInit {

  private elementRef = inject(ElementRef);
  private productService = inject(ProductService);

  saving = input<boolean>(false);
  serverError = input<string>('');

  closed = output<void>();
  save = output<PromotionCreateRequest>();

  targetTypeOptions: DropdownOption[] = [
    { id: 'PRODUCT', label: 'PRODUCT' },
    { id: 'CATEGORY', label: 'CATEGORY' }
  ];

  targetType = signal<PromotionTargetType>('CATEGORY');
  isTypeMenuOpen = signal(false);

  targetTypeLabel = computed(() =>
    this.targetTypeOptions.find(option => option.id === this.targetType())!.label
  );

  productOptions = signal<DropdownOption[]>([]);

  categoryOptions: DropdownOption[] = Object.values(ProductCategory).map(category => ({
    id: category,
    label: category
  }));

  targetOptions = computed<DropdownOption[]>(() =>
    this.targetType() === 'PRODUCT' ? this.productOptions() : this.categoryOptions
  );

  selectedTarget = signal<DropdownOption | null>(null);
  discount = signal<number | null>(null);
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);

  triedSave = signal(false);

  targetInvalid = computed(() => this.triedSave() && !this.selectedTarget());
  discountInvalid = computed(() => this.triedSave() && (this.discount() == null || this.discount()! <= 0 || this.discount()! > 100));
  startDateInvalid = computed(() => this.triedSave() && !this.startDate());
  endDateInvalid = computed(() => {
    if (!this.triedSave()) return false;
    if (!this.endDate()) return true;
    const start = this.startDate();
    const end = this.endDate();
    return !!start && !!end && end < start;
  });

  localError = signal('');

  displayError = computed(() => this.localError() || this.serverError());

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts({ page: 0, size: 1000, sortBy: 'name' }).subscribe({
      next: (response) => {
        this.productOptions.set(
          response.products
            .filter((p): p is typeof p & { id: number } => p.id !== undefined)
            .map(p => ({ id: p.id, label: p.name }))
        );
      }
    });
  }

  toggleTypeMenu(): void {
    this.isTypeMenuOpen.update(open => !open);
  }

  selectTargetType(option: DropdownOption): void {
    this.targetType.set(option.id as PromotionTargetType);
    this.selectedTarget.set(null);
    this.isTypeMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isTypeMenuOpen.set(false);
    }
  }

  onTargetSelected(option: DropdownOption): void {
    this.selectedTarget.set(option);
  }

  onDiscountChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.discount.set(value ? Number(value) : null);
  }

  onStartDateSelected(date: Date): void {
    this.startDate.set(date);
  }

  onEndDateSelected(date: Date): void {
    this.endDate.set(date);
  }

  cancel(): void {
    this.closed.emit();
  }

  submit(): void {
    this.triedSave.set(true);

    const target = this.selectedTarget();
    const discountValue = this.discount();
    const start = this.startDate();
    const end = this.endDate();

    if (!target || discountValue == null || !start || !end) {
      this.localError.set('Fill in all the fields.');
      return;
    }

    if (end < start) {
      this.localError.set('The end date has to be after the start date.');
      return;
    }

    if (discountValue <= 0 || discountValue > 100) {
      this.localError.set('The discount must be between 0 and 100.');
      return;
    }

    this.localError.set('');

    const targetType = this.targetType();

    const payload: PromotionCreateRequest = {
      targetType,
      discountPercentage: discountValue,
      startDate: this.toIsoDateTime(start, false),
      endDate: this.toIsoDateTime(end, true),
      ...(targetType === 'PRODUCT'
        ? { productId: Number(target.id) }
        : { category: String(target.id) })
    };

    this.save.emit(payload);
  }

  private toIsoDateTime(date: Date, endOfDay: boolean): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = endOfDay ? '23:59:59' : '00:00:00';
    return `${year}-${month}-${day}T${time}`;
  }
}