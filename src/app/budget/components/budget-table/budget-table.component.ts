import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ɵsetAllowDuplicateNgModuleIdsForTest } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContextMenuComponent } from '../context-menu/context-menu.component';

import { BudgetStoreService } from '../../services/budget-store.service';
import { CalculationService } from '../../services/calculation.service';
import { ContextMenuService } from '../../services/context-menu.service';

import { ParentGroup } from '../../models/parent-group.model';
import { ParentCategory } from '../../models/parent-category.model';
import { Category } from '../../models/category.model';
import { startWith } from 'rxjs';
import { DateRangeSelectorComponent } from '../date-range-selector/date-range-selector.component';

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContextMenuComponent,
    DateRangeSelectorComponent
  ],
  templateUrl: './budget-table.component.html'
})
export class BudgetTableComponent implements OnInit, AfterViewChecked {
  // grab the single Parent‐Category input we’ll create on init
  @ViewChildren('parentCategoryInput')
  parentInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChildren('categoryInput')
  categoryInputs!: QueryList<ElementRef<HTMLInputElement>>;

  /** only focus once */
  private didInitialFocus = false;
  constructor(
    public store: BudgetStoreService,
    public calc: CalculationService,
    public ctx: ContextMenuService
  ) { }

  ngOnInit() {
    // seed exactly one blank Parent under Income before view creation
    const incomeId = this.store.groups()[0].id;
    this.store.addParentCategory(incomeId);
  }

  ngAfterViewChecked() {
    // wait until the parentInputs QueryList has at least one element,
    // then focus the first, but only once
    if (!this.didInitialFocus && this.parentInputs?.length) {
      this.didInitialFocus = true;
      const first = this.parentInputs.first;
      first.nativeElement.focus();
      first.nativeElement.select();
    }
  }

  /** Pressing Enter in the Parent‐Category field adds the first Sub‐Category */
  onEnterCategory(groupId: string, parentId: string) {
    // add the new blank category row
    // this.store.addCategory(groupId, parentId);

    // wait for Angular to render the new <input>, then focus it
    setTimeout(() => {
      const inputs = this.categoryInputs.toArray();
      const last = inputs[inputs.length - 1];
      last?.nativeElement.focus();
      last?.nativeElement.select();
    }, 0);
  }

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
        [this.store.groups()[0]],
        [this.store.groups()[1]],
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
        [this.store.groups()[0]],
        [this.store.groups()[1]],
        months[i]
      );
      closes.push(running);
    }
    return closes;
  }

  trackByGroup = (_: number, g: ParentGroup) => g.id;
  trackByParent = (_: number, pc: ParentCategory) => pc.id;
  trackByCategory = (_: number, c: Category) => c.id;

  formatMonth(key: string): string {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, m - 1).toLocaleString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  }
  // excerpt from budget-table.component.ts
  onKeydown(
    event: KeyboardEvent,
    row: number,
    col: number,
    groupId: string,
    parentId: string
  ) {
    const lastCol = this.store.months().length;  // months count + the Category column at col=0
    let nextRow = row;
    let nextCol = col;
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        // create new category row
        this.store.addCategory(groupId, parentId);
        nextRow = row + 1;  // move into the new row
        nextCol = 0;        // first column
        break;
      case 'Tab':
        event.preventDefault();
        if (!event.shiftKey) {
          if (col === lastCol) {
            this.store.addCategory(groupId, parentId);
            nextRow = row + 1;
            nextCol = 0;
          } else {
            nextCol = col + 1;
          }
        } else {
          if (col === 0) {
            nextRow = Math.max(row - 1, 0);
            nextCol = lastCol;
          } else {
            nextCol = col - 1;
          }
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextCol = Math.min(col + 1, lastCol);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        nextCol = Math.max(col - 1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        nextRow = row + 1;
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextRow = Math.max(row - 1, 0);
        break;
      default:
        return;
    }

    setTimeout(() => {
      this.focusCell(nextRow, nextCol, groupId, parentId);
    }, 0);
  }

  private focusCell(
    row: number,
    col: number,
    groupId: string,
    parentId: string
  ) {
    const selector = `input[data-row="${row}"][data-col="${col}"]` +
      `[data-group="${groupId}"][data-parent="${parentId}"]`;
    const nextInput = document.querySelector<HTMLInputElement>(selector);
    if (nextInput) {
      nextInput.focus();
      nextInput.select?.();
    }
  }

/** wrapper: add a new parent category and immediately focus its input */
  addParentCategoryAndFocus(groupId: string) {
    this.store.addParentCategory(groupId);
    // wait for DOM update
    setTimeout(() => {
      const group = this.store.groups().find(g => g.id === groupId);
      if (!group || !group.children.length) return;
      const newParent = group.children[group.children.length - 1];
      // parent row has data-row = -1, data-col = 0
      this.focusCell(-1, 0, groupId, newParent.id);
    }, 0);
  }

  /** wrapper: add a new category under parent and focus its name input */
  addCategoryAndFocus(groupId: string, parentId: string) {
    this.store.addCategory(groupId, parentId);
    setTimeout(() => {
      const group = this.store.groups().find(g => g.id === groupId);
      if (!group) return;
      const parent = group.children.find(pc => pc.id === parentId);
      if (!parent || !parent.children.length) return;
      const index = parent.children.length - 1;
      // category cell has data-row = index, data-col = 0
      this.focusCell(index, 0, groupId, parentId);
    }, 0);
  }
}
