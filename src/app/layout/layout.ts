import { Component, inject, signal } from '@angular/core';
import { Header } from '../shared/components/header/header';
import { Sidebar } from '../shared/components/sidebar/sidebar';
import { LayoutService } from '../core/services/layout.service';

@Component({
  standalone: true,
  imports: [Header, Sidebar],
  selector: 'app-layout',
  templateUrl: './layout.html',
})
export class Layout {
  private _layoutService = inject(LayoutService);
  
}
  