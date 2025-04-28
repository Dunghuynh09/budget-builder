import { TestBed } from '@angular/core/testing';

import { BudgetStoreService } from './budget-store.service';

describe('BudgetStoreService', () => {
  let service: BudgetStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
