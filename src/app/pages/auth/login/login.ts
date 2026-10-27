import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DxButtonModule, DxTextBoxModule } from 'devextreme-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DxTextBoxModule, DxButtonModule, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly userNameOrEmail = signal<string>('');
  readonly password = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  onLogin(): void {
    const username = this.userNameOrEmail().trim();
    const password = this.password();

    if (!username || !password) {
      this.errorMessage.set('Vui lòng nhập tên đăng nhập/email và mật khẩu.');
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login(username, password).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success && res.data) {
          this.authService.setUser(res.data);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.errorMessage.set(res.message || 'Đăng nhập không thành công.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại.'
        );
      },
    });
  }
}
