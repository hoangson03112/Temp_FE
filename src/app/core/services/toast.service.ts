import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _message = signal<string>('');
  private readonly _type = signal<ToastType>('success');
  private readonly _isVisible = signal<boolean>(false);

  readonly message = this._message.asReadonly();
  readonly type = this._type.asReadonly();
  readonly isVisible = this._isVisible.asReadonly();

  show(msg: string, type: ToastType = 'success'): void {
    this._message.set(msg);
    this._type.set(type);
    this._isVisible.set(true);
  }

  hide(): void {
    this._isVisible.set(false);
  }
}