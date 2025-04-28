import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsRowComponent } from './totals-row.component';

describe('TotalsRowComponent', () => {
  let component: TotalsRowComponent;
  let fixture: ComponentFixture<TotalsRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalsRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalsRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
