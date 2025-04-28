import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentGroup } from '../../models/parent-group.model';
import { CalculationService } from '../../services/calculation.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-totals-row',
  templateUrl: 'totals-row.component.html'
})
export class TotalsRowComponent {
  @Input() label!: string;
  @Input() groups: ParentGroup[] = [];
  @Input() months: string[] = [];

  constructor(public calc: CalculationService) {}
}
