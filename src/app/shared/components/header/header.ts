import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroBars3 } from '@ng-icons/heroicons/outline';
import { AuthService } from '../../../core/services/auth.service';
import { LayoutService } from '../../../core/services/layout.service';
import { DxButtonModule, DxLoadPanelModule, DxPopupModule } from 'devextreme-angular';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.html',
  providers: [provideIcons({ heroBars3 })],
  imports: [CommonModule, NgIcon, DxButtonModule, DxPopupModule, DxLoadPanelModule],
})
export class Header {
  protected authService = inject(AuthService);
  protected layoutService = inject(LayoutService);
  readonly isLoading = signal(false);

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }
}
