import { Component, input, output, signal, computed, HostListener, ElementRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Promotion } from '../../models/promotion.model';
import { CalendarComponent } from '../calendar/calendar';

type TargetTypeFilter = 'PRODUCT' | 'CATEGORY' | null;
type StatusFilter = 'SCHEDULED' | 'ACTIVE' | 'FINISHED' | null;

@Component({
  selector: 'app-promotions-list',
  standalone: true,
  imports: [CommonModule, CalendarComponent],
  templateUrl: './promotions-list.html',
  styleUrl: './promotions-list.css'
})
export class PromotionsListComponent{

  private elementRef = inject(ElementRef);

  promotions = input<Promotion[]>([]);
  currentPage = input<number>(0);
  totalPages = input<number>(0);

  targetTypeFilter = input<TargetTypeFilter>(null);
  startDateFilter = input<Date | null>(null);
  endDateFilter = input<Date | null>(null);
  statusFilter = input<StatusFilter>(null);

  previousPage = output<void>();
  nextPage = output<void>();

  targetTypeFilterChange = output<TargetTypeFilter>();
  startDateFilterChange = output<Date | null>();
  endDateFilterChange = output<Date | null>();
  statusFilterChange = output<StatusFilter>();

  // UI state (open/closed)
  isTargetTypeMenuOpen = signal(false);
  isStartCalendarOpen = signal(false);
  isEndCalendarOpen = signal(false);
  isStatusMenuOpen = signal(false);

  targetTypeOptions: { id: 'ALL' | 'PRODUCT' | 'CATEGORY'; label: string }[] = [
    { id: 'ALL', label: 'PROMOTION' },
    { id: 'PRODUCT', label: 'PRODUCTS' },
    { id: 'CATEGORY', label: 'CATEGORY' }
  ];

  targetTypeLabel = computed(() => {
    const current = this.targetTypeFilter();
    const found = this.targetTypeOptions.find(option => option.id === (current ?? 'ALL'));
    return found?.label ?? 'PRODUCTS';
  });

  statusOptions: { id: 'SCHEDULED' | 'ACTIVE' | 'FINISHED'; label: string }[] = [
    { id: 'SCHEDULED', label: 'SCHEDULED' },
    { id: 'ACTIVE', label: 'ACTIVE' },
    { id: 'FINISHED', label: 'FINISHED' }
  ];

  get isFirstPage(): boolean {
    return this.currentPage() <= 0;
  }

  get isLastPage(): boolean {
    return this.currentPage() >= this.totalPages() - 1;
  }

  toggleTargetTypeMenu(): void {
    this.closeAllExcept('targetType');
    this.isTargetTypeMenuOpen.update(open => !open);
  }

  selectTargetType(id: 'ALL' | 'PRODUCT' | 'CATEGORY'): void {
    this.targetTypeFilterChange.emit(id === 'ALL' ? null : id);
    this.isTargetTypeMenuOpen.set(false);
  }

  toggleStartCalendar(): void {
    this.closeAllExcept('startDate');
    this.isStartCalendarOpen.update(open => !open);
  }

  onStartDateSelected(date: Date): void {
    this.startDateFilterChange.emit(date);
    this.isStartCalendarOpen.set(false);
  }

  toggleEndCalendar(): void {
    this.closeAllExcept('endDate');
    this.isEndCalendarOpen.update(open => !open);
  }

  onEndDateSelected(date: Date): void {
    this.endDateFilterChange.emit(date);
    this.isEndCalendarOpen.set(false);
  }

  toggleStatusMenu(): void {
    this.closeAllExcept('status');
    this.isStatusMenuOpen.update(open => !open);
  }

  selectStatus(status: 'SCHEDULED' | 'ACTIVE' | 'FINISHED'): void {
    this.statusFilterChange.emit(this.statusFilter() === status ? null : status);
    this.isStatusMenuOpen.set(false);
  }

  private closeAllExcept(keep: 'targetType' | 'startDate' | 'endDate' | 'status'): void {
    if (keep !== 'targetType') this.isTargetTypeMenuOpen.set(false);
    if (keep !== 'startDate') this.isStartCalendarOpen.set(false);
    if (keep !== 'endDate') this.isEndCalendarOpen.set(false);
    if (keep !== 'status') this.isStatusMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isTargetTypeMenuOpen.set(false);
      this.isStartCalendarOpen.set(false);
      this.isEndCalendarOpen.set(false);
      this.isStatusMenuOpen.set(false);
    }
  }

}