import { Component, input, output, signal, computed } from '@angular/core';

interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarComponent {

  selectedDate = input<Date | null>(null);
  dateSelected = output<Date>();

  private today = new Date();
  viewDate = signal<Date>(this.selectedDate() ?? new Date());

  weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  monthLabel = computed(() =>
    this.viewDate().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  );

  days = computed<CalendarDay[]>(() => {
    const view = this.viewDate();
    const year = view.getFullYear();
    const month = view.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);

    const selected = this.selectedDate();
    const result: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);

      result.push({
        date,
        inCurrentMonth: date.getMonth() === month,
        isSelected: !!selected && this.isSameDay(date, selected),
        isToday: this.isSameDay(date, this.today)
      });
    }

    return result;
  });

  previousMonth(): void {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectDay(day: CalendarDay): void {
    this.dateSelected.emit(day.date);
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }
}