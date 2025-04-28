import { Injectable, signal } from '@angular/core';
import { BudgetStoreService } from './budget-store.service';

export interface ContextMenuState {
  open: boolean;
  x: number;
  y: number;
  monthKey?: string;
  value?: number;
}

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  menuState = signal<ContextMenuState>({
    open: false,
    x: 0,
    y: 0
  });

  constructor(private store: BudgetStoreService) {}

  open(event: MouseEvent, monthKey: string, currentValue: number) {
    event.preventDefault();
    this.menuState.set({
      open: true,
      x: event.clientX,
      y: event.clientY,
      monthKey,
      value: currentValue
    });
  }

  applyToAll() {
    const { monthKey, value } = this.menuState();
    if (monthKey != null && value != null) {
      this.store.fillColumn(monthKey, value);
    }
    this.close();
  }

  close() {
    this.menuState.update((s: ContextMenuState) => ({
      ...s,
      open: false
     }));
  }
}
