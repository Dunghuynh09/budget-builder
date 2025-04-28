import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuService } from '../../services/context-menu.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-context-menu',
  templateUrl: 'context-menu.component.html'
})
export class ContextMenuComponent {
  constructor(public ctx: ContextMenuService) {}

  @HostListener('document:click')
  onDocClick() {
    this.ctx.close();
  }
}
