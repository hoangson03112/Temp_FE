import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { DxToastModule } from 'devextreme-angular';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DxToastModule],
  template: `
    @if (auth.bootstrapped()) {
      <dx-toast
        [visible]="toastService.isVisible()"
        [message]="toastService.message()"
        [type]="toastService.type()"
        [displayTime]="3000"
        [width]="300"
        (onHiding)="toastService.hide()"
        [position]="{
          my: { x: 'right', y: 'top' },
          at: { x: 'right', y: 'top' },
          offset: { x: -20, y: 20 },
        }"
      >
      </dx-toast>
      <router-outlet />
    } @else {
      <div class="app-loading">
        <div class="app-loading__spinner"></div>
        <p>Đang kiểm tra phiên...</p>
      </div>
    }
  `,
  styles: `
    .app-loading {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      font-family: system-ui, sans-serif;
      color: #6b7280;
    }

    .app-loading__spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #2563eb;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 12px;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class App {
  readonly auth = inject(AuthService);
  readonly toastService = inject(ToastService);
}
