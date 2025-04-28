import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { BudgetStoreService } from '../../services/budget-store.service';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-category-row',
  templateUrl:'category-row.component.html'
})
export class CategoryRowComponent {
  @Input() parentId!: string;
  @Input() category!: Category;
  @Input() months!: string[];

  constructor(
    public store: BudgetStoreService,
    public ctx: ContextMenuService
  ) {}

  change(monthKey: string, value: number) {
    this.store.updateCategoryValue(
      this.parentId,
      this.category.id,
      monthKey,
      value
    );
  }
}
