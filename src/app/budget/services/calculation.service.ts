import { Injectable } from '@angular/core';
import { ParentGroup }    from '../models/parent-group.model';
import { ParentCategory } from '../models/parent-category.model';
import { Category }       from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CalculationService {
  sumParentCategory(pc: ParentCategory, monthKey: string): number {
    return pc.children.reduce(
      (total, c: Category) => total + (c.values[monthKey] || 0),
      0
    );
  }

  sumGroup(group: ParentGroup, monthKey: string): number {
    return group.children.reduce(
      (total, pc: ParentCategory) =>
        total + this.sumParentCategory(pc, monthKey),
      0
    );
  }

  sumAll(groups: ParentGroup[], monthKey: string): number {
    return groups.reduce(
      (total, g) => total + this.sumGroup(g, monthKey),
      0
    );
  }

  profitLoss(
    incomeGroups: ParentGroup[],
    expenseGroups: ParentGroup[],
    monthKey: string
  ): number {
    return this.sumAll(incomeGroups, monthKey)
         - this.sumAll(expenseGroups, monthKey);
  }

  carryBalance(prev: number, profit: number): number {
    return prev + profit;
  }
}
