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

  onRangeChange(start: string, end: string) {
    // optionally, you could clamp / validate here
    this.store.updateRange(start, end);
  }
}
