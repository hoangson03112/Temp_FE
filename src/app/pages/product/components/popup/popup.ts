import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DxButtonModule,
  DxPopupModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
} from 'devextreme-angular';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DxPopupModule,
    DxButtonModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
  ],
  selector: 'app-popup',
  templateUrl: './popup.html',
})
export class Popup {
  @Input() isVisible = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Input() mode: 'add' | 'edit' = 'add';
  @Input() productData: any = {};

  @Output() onSave = new EventEmitter<void>();

  readonly statusOptions = [
    { value: 1, text: 'Đang bán' },
    { value: 0, text: 'Ngừng bán' },
  ];

  save() {
    this.onSave.emit();
  }

  close() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }
}
