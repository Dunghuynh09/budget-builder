import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

import { ContextMenuComponent }      from '../context-menu/context-menu.component';

import { BudgetStoreService }  from '../../services/budget-store.service';
import { CalculationService }  from '../../services/calculation.service';
import { ContextMenuService }  from '../../services/context-menu.service';

import { ParentGroup }    from '../../models/parent-group.model';
import { ParentCategory } from '../../models/parent-category.model';
import { Category }       from '../../models/category.model';

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContextMenuComponent
  ],
  templateUrl: './budget-table.component.html'
})
export class BudgetTableComponent {
  constructor(
    public store: BudgetStoreService,
    public calc:  CalculationService,
    public ctx:   ContextMenuService
  ) {}

  trackByIndex(_: number, __: string) {
    return _; 
  }

  get openingBalances(): number[] {
    const months = this.store.months();
    const opens: number[] = [];
    let running = 0;
    for (let i = 0; i < months.length; i++) {
      opens.push(running);
      running += this.calc.profitLoss(
        [ this.store.groups()[0] ],
        [ this.store.groups()[1] ],
        months[i]
      );
    }
    return opens;
  }
  
  get closingBalances(): number[] {
    const months = this.store.months();
    const closes: number[] = [];
    let running = 0;
    for (let i = 0; i < months.length; i++) {
      running += this.calc.profitLoss(
        [ this.store.groups()[0] ],
        [ this.store.groups()[1] ],
        months[i]
      );
      closes.push(running);
    }
    return closes;
  }

  trackByGroup   = (_: number, g: ParentGroup)       => g.id;
  trackByParent  = (_: number, pc: ParentCategory)  => pc.id;
  trackByCategory= (_: number, c: Category)         => c.id;

  formatMonth(key: string): string {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, m - 1).toLocaleString('en-US', {
      month: 'short',
      year:  'numeric'
    });
  }
}
