import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetStoreService } from '../../services/budget-store.service';

@Component({
  standalone: true,
  selector: 'app-date-range-selector',
  imports: [CommonModule, FormsModule],
  templateUrl: 'date-range-selector.component.html'
})
export class DateRangeSelectorComponent {
  constructor(public store: BudgetStoreService) {}

  toInput(d: Date) {
    const m = d.getMonth() + 1;
    return `${d.getFullYear()}-${m.toString().padStart(2, '0')}`;
  }

  updateStart(val: string) {
    const [y, m] = val.split('-').map(Number);
    const { end } = this.store.dateRange();
    this.store.dateRange.set({ start: new Date(y, m - 1, 1), end });
  }

  updateEnd(val: string) {
    const [y, m] = val.split('-').map(Number);
    const { start } = this.store.dateRange();
    this.store.dateRange.set({ start, end: new Date(y, m - 1, 1) });
  }
}
