import { Component, input, output} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Promotion } from '../../models/promotion.model';

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotions-list.html',
  styleUrl: './promotions-list.css'
})
export class PromotionsListComponent{

  promotions = input<Promotion[]>([]);
  currentPage = input<number>(0);
  totalPages = input<number>(0);

  previousPage = output<void>();
  nextPage = output<void>();

  get isFirstPage(): boolean {
    return this.currentPage() <= 0;
  }

  get isLastPage(): boolean {
    return this.currentPage() >= this.totalPages() - 1;
  }

}