import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../core/services/layout.service';
import { DxDrawerModule } from 'devextreme-angular';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent, DxDrawerModule],
  templateUrl: './sidebar.html',
})
export class Sidebar implements OnDestroy {
  protected authService = inject(AuthService);
  private router = inject(Router);
  private layoutService = inject(LayoutService);
  isSidebarOpen = true;
  private subs = new Subscription();

  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'heroHome', badge: 0 },
    { label: 'Quản lý sản phẩm', path: '/san-pham', icon: 'heroDocumentText' },
    { label: 'Quản lý danh mục', path: '/danh-muc', icon: 'heroDocumentText' },
    { label: 'Quản lý người dùng', path: '/nguoi-dung', icon: 'heroUsers', roles: ['HR', 'Admin'] },
    { label: 'Cấu hình mẫu 12', path: '/custom-mau12', icon: 'heroUsers', roles: ['HR', 'Admin'] },
    { label: 'Cấu hình', path: '/settings', icon: 'heroCog', roles: ['Admin'] },
  ];
  logout() {
    this.authService.logout();
  }
  handleNavSelect(event: any) {
    const selectedItem = event.addedItems[0];
    if (selectedItem) {
      this.router.navigate([selectedItem.path]);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  handleNavClick(item: NavItem): void {
    if (this.layoutService.isOpenSidebar()) {
      this.layoutService.toggleSidebar();
    }
  }
}
