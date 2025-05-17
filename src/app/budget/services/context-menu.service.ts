import { Injectable, signal } from '@angular/core';
import { BudgetStoreService } from './budget-store.service';

export interface ContextMenuState {
  open:     boolean;
  x:        number;
  y:        number;
  groupId:  string;
  parentId: string;
  catId:    string;
  monthKey: string;
}

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  menuState = signal<ContextMenuState>({
    open: false,
    x: 0, y: 0,
    groupId: '', parentId: '', catId: '', monthKey: ''
  });

  constructor(private store: BudgetStoreService) {}

  open(evt: MouseEvent, g: string, p: string, c: string, m: string) {
    evt.preventDefault();
    this.menuState.set({ open: true, x: evt.clientX, y: evt.clientY,
                         groupId: g, parentId: p, catId: c, monthKey: m });
  }

  applyToAll() {
    const s = this.menuState();
    // read the single cell’s current value
    const val = this.store.getValue(s.groupId, s.parentId, s.catId, s.monthKey);
    // fill across all months for that cat
    this.store.fillCategoryAcrossMonths(s.groupId, s.parentId, s.catId, val);
    // close menu
   	this.close(); 
  }


  close() {
    this.menuState.update((s: ContextMenuState) => ({
      ...s,
      open: false
     }));
  }
}
