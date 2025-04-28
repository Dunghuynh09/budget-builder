import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentGroupComponent } from './parent-group.component';

describe('ParentGroupComponent', () => {
  let component: ParentGroupComponent;
  let fixture: ComponentFixture<ParentGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
