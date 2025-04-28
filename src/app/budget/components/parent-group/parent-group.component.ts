import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentGroup } from '../../models/parent-group.model';
import { BudgetStoreService } from '../../services/budget-store.service';
import { CategoryRowComponent } from '../category-row/category-row.component';
import { TotalsRowComponent } from '../totals-row/totals-row.component';

@Component({
  standalone: true,
  imports: [CommonModule, CategoryRowComponent, TotalsRowComponent],
  selector: 'app-parent-group',
  templateUrl: 'parent-group.component.html'
})
export class ParentGroupComponent {
  @Input() group!: ParentGroup;
  @Input() months: string[] = [];

  constructor(public store: BudgetStoreService) {}
}
