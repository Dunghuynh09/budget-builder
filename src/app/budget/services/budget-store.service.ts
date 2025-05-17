import { Injectable, signal, computed } from '@angular/core';
import { ParentGroup } from '../models/parent-group.model';
import { v4 as uuid }  from 'uuid';

@Injectable({ providedIn: 'root' })
export class BudgetStoreService {
  // -- range selectors, default Jan–Dec 2024 --
  start = signal<string>('2024-01');
  end   = signal<string>('2024-12');


  months = computed(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const [ys, ms] = this.start().split('-').map(Number);
    const [ye, me] = this.end().split('-').map(Number);

    const out: string[] = [];
    let y = ys, m = ms;
    while (y < ye || (y === ye && m <= me)) {
      out.push(`${y}-${pad(m)}`);
      m++;
      if (m > 12) { m = 1; y++; }
    }
    return out;
  });

  groups = signal<ParentGroup[]>([
    { id: uuid(), name: 'Income',   children: [] },
    { id: uuid(), name: 'Expenses', children: [] }
  ]);
  
  updateRange(newStart: string, newEnd: string) {
    this.start.set(newStart);
    this.end.set(newEnd);
  }

  addParentCategory(groupId: string, name = '') {
    this.groups.update(gs =>
      gs.map(g =>
        g.id === groupId
          ? { ...g, children: [...g.children, { id: uuid(), name, children: [] }] }
          : g
      )
    );
  }

  updateParentCategoryName(groupId: string, parentCatId: string, name: string) {
    this.groups.update(gs =>
      gs.map(g =>
        g.id === groupId
          ? {
              ...g,
              children: g.children.map(pc =>
                pc.id === parentCatId ? { ...pc, name } : pc
              )
            }
          : g
      )
    );
  }

  removeParentCategory(groupId: string, parentCatId: string) {
    this.groups.update(gs =>
      gs.map(g =>
        g.id === groupId
          ? { ...g, children: g.children.filter(pc => pc.id !== parentCatId) }
          : g
      )
    );
  }

  addCategory(groupId: string, parentCatId: string, name = '') {
    this.groups.update(gs =>
      gs.map(g =>
        g.id === groupId
          ? {
              ...g,
              children: g.children.map(pc =>
                pc.id === parentCatId
                  ? { ...pc, children: [...pc.children, { id: uuid(), name, values: {} }] }
                  : pc
              )
            }
          : g
      )
    );
  }

  updateCategoryName(groupId: string, parentCatId: string, categoryId: string, name: string) {
    this.groups.update(gs =>
      gs.map(g =>
        g.id === groupId
          ? {
              ...g,
              children: g.children.map(pc =>
                pc.id === parentCatId
                  ? {
                      ...pc,
                      children: pc.children.map(c =>
                        c.id === categoryId ? { ...c, name } : c
                      )
                    }
                  : pc
              )
            }
          : g
      )
    );
  }

  removeCategory(groupId: string, parentCatId: string, categoryId: string) {
    this.groups.update(gs =>
      gs.map(g =>
        g.id === groupId
          ? {
              ...g,
              children: g.children.map(pc =>
                pc.id === parentCatId
                  ? { ...pc, children: pc.children.filter(c => c.id !== categoryId) }
                  : pc
              )
            }
          : g
      )
    );
  }

  updateCategoryValue(groupId: string, parentCatId: string, categoryId: string, monthKey: string, value: number) {
    this.groups.update(gs =>
      gs.map(g =>
        g.id === groupId
          ? {
              ...g,
              children: g.children.map(pc =>
                pc.id === parentCatId
                  ? {
                      ...pc,
                      children: pc.children.map(c =>
                        c.id === categoryId
                          ? { ...c, values: { ...c.values, [monthKey]: value } }
                          : c
                      )
                    }
                  : pc
              )
            }
          : g
      )
    );
  }

  fillColumn(monthKey: string, value: number) {
    this.groups.update(gs =>
      gs.map(g => ({
        ...g,
        children: g.children.map(pc => ({
          ...pc,
          children: pc.children.map(cat => ({
            ...cat,
            values: { ...cat.values, [monthKey]: value }
          }))
        }))
      }))
    );
  }

  getValue(groupId: string, parentId: string, catId: string, monthKey: string): number {
    const g = this.groups().find(g => g.id === groupId)!;
    const p = g.children.find(p => p.id === parentId)!;
    const c = p.children.find(c => c.id === catId)!;
    return c.values[monthKey] || 0;
  }
  fillCategoryAcrossMonths(
      groupId: string,
      parentId: string,
      catId: string,
      value: number
  ) {
    this.groups.update(gs => {
      return gs.map(g => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          children: g.children.map(p => {
            if (p.id !== parentId) return p;
            return {
              ...p,
              children: p.children.map(c => {
                if (c.id !== catId) return c;
                // apply to every month key
                const newVals = { ...c.values };
                for (const m of this.months()) {
                  newVals[m] = value;
                }
                return { ...c, values: newVals };
              })
            };
          })
        };
      });
    });
  }
}