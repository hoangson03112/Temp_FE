import { NgClass, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  DxButtonGroupModule,
  DxButtonModule,
  DxPopoverModule,
  DxSelectBoxModule,
} from 'devextreme-angular';

export interface FontStyleValue {
  family: string;
  size: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

let uid = 0;

@Component({
  selector: 'app-font-picker',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    DxButtonModule,
    DxPopoverModule,
    DxSelectBoxModule,
    DxButtonGroupModule,
  ],
  templateUrl: './font-picker.html',
})
export class FontPicker implements OnInit, OnChanges {
  @Input() value: FontStyleValue = {
    family: 'Times New Roman',
    size: 12,
    bold: false,
    italic: false,
    underline: false,
  };
  @Output() valueChange = new EventEmitter<FontStyleValue>();

  readonly btnId = `font-picker-btn-${uid++}`;
  popoverVisible = false;

  fonts = ['Times New Roman', 'Arial', 'Calibri', 'Tahoma', 'Verdana', 'Courier New'];
  sizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36];

  styleItems = [
    { key: 'bold', icon: 'bold', hint: 'In đậm' },
    { key: 'italic', icon: 'italic', hint: 'In nghiêng' },
    { key: 'underline', icon: 'underline', hint: 'Gạch chân' },
  ];

  summary = '';
  selectedKeys: string[] = [];
  previewStyle: Record<string, string> = {};

  ngOnInit() {
    this.refresh();
  }
  ngOnChanges() {
    this.refresh();
  }

  private refresh() {
    const v = this.value;
    const styles = [v.bold && 'bold', v.italic && 'italic', v.underline && 'underline']
      .filter(Boolean)
      .join(', ');

    this.summary = [v.family, v.size, styles].filter((x) => x !== '').join(';  ');
    this.selectedKeys = this.styleItems.map((i) => i.key).filter((k) => (v as any)[k]);
    this.previewStyle = {
      'font-family': `'${v.family}'`,
      'font-size': `${Math.min(v.size, 28)}px`,
      'font-weight': v.bold ? '700' : '400',
      'font-style': v.italic ? 'italic' : 'normal',
      'text-decoration': v.underline ? 'underline' : 'none',
    };
  }

  patch(part: Partial<FontStyleValue>) {
    this.value = { ...this.value, ...part };
    this.refresh();
    this.valueChange.emit(this.value);
  }

  onStyleChanged(e: any) {
    const keys: string[] = e.component.option('selectedItemKeys') ?? [];
    this.patch({
      bold: keys.includes('bold'),
      italic: keys.includes('italic'),
      underline: keys.includes('underline'),
    });
  }

  reset() {
    this.patch({
      family: 'Times New Roman',
      size: 12,
      bold: false,
      italic: false,
      underline: false,
    });
  }
}
