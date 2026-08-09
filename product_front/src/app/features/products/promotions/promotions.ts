import { OnInit, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Promotion } from '../models/promotion.model';
import { PromotionCreateRequest } from '../models/promotion-create.model';
import { PromotionService } from '../service/promotion.service';
import { PromotionsListComponent } from './promotions-list/promotions-list';
import { PromotionFormModalComponent } from './promotion-form-modal/promotion-form-modal';
import { ToastService } from '../service/toast.service';

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

    this.promotionService.getAllPromotions().subscribe({
      next: (promotions) => {
        this.promotions.set(promotions);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading promotions');
        this.loading.set(false);
      }
    });
  }

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