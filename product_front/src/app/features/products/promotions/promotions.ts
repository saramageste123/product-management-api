import { OnInit, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Promotion } from '../models/promotion.model';
import { PromotionCreateRequest } from '../models/promotion-create.model';
import { PromotionService } from '../service/promotion.service';
import { PromotionsListComponent } from './promotions-list/promotions-list';
import { PromotionFormModalComponent } from './promotion-form-modal/promotion-form-modal';
import { ToastService } from '../service/toast.service';

type TargetTypeFilter = 'PRODUCT' | 'CATEGORY' | null;
type StatusFilter = 'SCHEDULED' | 'ACTIVE' | 'FINISHED' | null;

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, PromotionsListComponent, PromotionFormModalComponent],
  templateUrl: './promotions.html',
  styleUrl: './promotions.css'
})
export class PromotionsComponent implements OnInit {

  promotions = signal<Promotion[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  showModal = signal(false);
  creatingPromotion = signal(false);
  createError = signal('');

  // Pagination
  currentPage = signal(0);
  totalPages = signal(0);
  readonly pageSize = 5;

  // Filters
  targetTypeFilter = signal<TargetTypeFilter>(null);
  startDateFilter = signal<Date | null>(null);
  endDateFilter = signal<Date | null>(null);
  statusFilter = signal<StatusFilter>(null);

  hasActiveFilters = computed(() =>
    !!this.targetTypeFilter() || !!this.startDateFilter() || !!this.endDateFilter() || !!this.statusFilter()
  );

  constructor(
    private router: Router,
    private promotionService: PromotionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  loadPromotions(): void {
    this.loading.set(true);

    this.promotionService.getPromotions(this.currentPage(), this.pageSize, 'startDate,desc', {
      targetType: this.targetTypeFilter(),
      startDate: this.startDateFilter() ? this.toIsoDate(this.startDateFilter()!) : null,
      endDate: this.endDateFilter() ? this.toIsoDate(this.endDateFilter()!) : null,
      status: this.statusFilter()
    }).subscribe({
      next: (response) => {
        this.promotions.set(response.promotions);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading promotions');
        this.loading.set(false);
      }
    });
  }

  //Pagination
  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(page => page + 1);
      this.loadPromotions();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(page => page - 1);
      this.loadPromotions();
    }
  }

  // Filters
  setTargetTypeFilter(type: TargetTypeFilter): void {
    this.targetTypeFilter.set(this.targetTypeFilter() === type ? null : type);
    this.currentPage.set(0);
    this.loadPromotions();
  }

  setStartDateFilter(date: Date | null): void {
    this.startDateFilter.set(date);
    this.currentPage.set(0);
    this.loadPromotions();
  }

  setEndDateFilter(date: Date | null): void {
    this.endDateFilter.set(date);
    this.currentPage.set(0);
    this.loadPromotions();
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(this.statusFilter() === status ? null : status);
    this.currentPage.set(0);
    this.loadPromotions();
  }

  clearFilters(): void {
    this.targetTypeFilter.set(null);
    this.startDateFilter.set(null);
    this.endDateFilter.set(null);
    this.statusFilter.set(null);
    this.currentPage.set(0);
    this.loadPromotions();
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //Create Modal
  openCreateModal(): void {
    this.createError.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onCreatePromotion(payload: PromotionCreateRequest): void {
    this.creatingPromotion.set(true);
    this.createError.set('');

    this.promotionService.createPromotion(payload).subscribe({
      next: () => {
        this.creatingPromotion.set(false);
        this.showModal.set(false);
        this.currentPage.set(0);
        this.loadPromotions();
        this.toastService.show('Promotion created successfully!');
      },
      error: (err) => {
        this.creatingPromotion.set(false);
        this.createError.set(err?.error?.message ?? 'Error saving the promotion.');
      }
    });
  }
}