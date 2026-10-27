import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DxButtonModule, DxTextBoxModule } from 'devextreme-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DxTextBoxModule, DxButtonModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly userName = signal<string>('');
  readonly email = signal<string>('');
  readonly fullName = signal<string>('');
  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly successMessage = signal<string>('');

  onRegister(): void {
    const userName = this.userName().trim();
    const email = this.email().trim();
    const fullName = this.fullName().trim();
    const password = this.password();
    const confirmPassword = this.confirmPassword();

    if (!userName || !email || !password) {
      this.errorMessage.set('Vui lòng điền đầy đủ Tên đăng nhập, Email và Mật khẩu.');
      return;
    }

    if (password.length < 6) {
      this.errorMessage.set('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage.set('Mật khẩu xác nhận không khớp.');
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    this.authService
      .register({
        userName,
        email,
        password,
        fullName: fullName || undefined,
      })
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.success) {
            this.successMessage.set('Đăng ký thành công! Đang chuyển hướng...');
            if (res.data) {
              this.authService.setUser(res.data);
            }
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          } else {
            this.errorMessage.set(res.message || 'Đăng ký không thành công.');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            err?.error?.message || err?.error?.errors?.[0] || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
          );
        },
      });
  }
}
