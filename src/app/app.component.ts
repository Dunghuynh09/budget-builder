import { Component } from '@angular/core';
import { BudgetTableComponent } from './budget/components/budget-table/budget-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BudgetTableComponent],
  templateUrl: 'app.component.html'
})
export class AppComponent {}