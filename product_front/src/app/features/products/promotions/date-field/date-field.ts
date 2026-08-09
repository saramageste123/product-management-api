import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './date-field.html',
  styleUrl: './date-field.css'
})
export class DateFieldComponent {

  private elementRef = inject(ElementRef);

  label = input<string>('');
  placeholder = input<string>('dd/mm/yyyy');
  selectedDate = input<Date | null>(null);
  invalid = input<boolean>(false);

  dateSelected = output<Date>();

  isOpen = signal(false);

  get displayValue(): string {
    const date = this.selectedDate();
    return date ? date.toLocaleDateString('pt-BR') : '';
  }

  toggle(): void {
    this.isOpen.update(open => !open);
  }

  onDaySelected(date: Date): void {
    this.dateSelected.emit(date);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}