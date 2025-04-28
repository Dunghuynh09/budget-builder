import { TestBed } from '@angular/core/testing';

import { KeyboardNavService } from './keyboard-nav.service';

describe('KeyboardNavService', () => {
  let service: KeyboardNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
