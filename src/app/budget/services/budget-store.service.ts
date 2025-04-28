import { Injectable, signal, computed } from '@angular/core';
import { ParentGroup } from '../models/parent-group.model';
import { v4 as uuid }  from 'uuid';

@Injectable({ providedIn: 'root' })
export class BudgetStoreService {
  months = signal<string[]>(['']);

  updateMonth(index: number, newName: string) {
    this.months.update(ms => {
      const copy = [...ms];
      copy[index] = newName;
      if (index === ms.length - 1 && newName) {
        copy.push('');
      }
      return copy;
    });
  }

  groups = signal<ParentGroup[]>([
    { id: uuid(), name: 'Income',   children: [] },
    { id: uuid(), name: 'Expenses', children: [] }
  ]);

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
          children: pc.children.map(c => ({
            ...c,
            values: { ...c.values, [monthKey]: value }
          }))
        }))
      }))
    );
  }
}