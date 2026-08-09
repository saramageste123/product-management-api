import { Component, input, output, signal, HostListener, ElementRef, inject } from '@angular/core';

export interface DropdownOption {
  id: string | number;
  label: string;
}

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-select.html',
  styleUrl: './dropdown-select.css'
})
export class DropdownSelectComponent {

  private elementRef = inject(ElementRef);

  options = input<DropdownOption[]>([]);
  selected = input<DropdownOption | null>(null);
  placeholder = input<string>('Select...');
  variant = input<'default' | 'compact'>('default');
  invalid = input<boolean>(false);

  optionSelected = output<DropdownOption>();

  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(open => !open);
  }

  select(option: DropdownOption): void {
    this.optionSelected.emit(option);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}