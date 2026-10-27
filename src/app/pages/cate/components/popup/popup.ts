import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DxButtonModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { Category } from '../../Category.type';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DxPopupModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxButtonModule,
  ],
  selector: 'app-cate-popup',
  templateUrl: './popup.html',
})
export class PopupCate {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Input() mode: 'add' | 'edit' = 'add';
  @Input() categoryData: Category = {};

  @Output() onSave = new EventEmitter<void>();

  readonly statusOptions = [
    { value: 1, text: 'Hoạt động' },
    { value: 0, text: 'Bị khoá' },
  ];

  onSaveCate(): void {
    this.onSave.emit();
  }

  close(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }
}
