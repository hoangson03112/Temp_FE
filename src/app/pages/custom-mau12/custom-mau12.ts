import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Thêm CommonModule nếu cần
import { FormsModule } from '@angular/forms'; // <--- QUAN TRỌNG: Thêm FormsModule để dùng [(ngModel)]
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxLoadPanelModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { Layout } from '../../layout/layout';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { CauHinh, TextStyle } from './custome.type';
import { FontPicker, FontStyleValue } from './components/font-picker/font-picker';
import { CustomService } from './custom.service';

@Component({
  selector: 'app-custom-mau12',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DxLoadPanelModule,
    DxButtonModule,
    DxToolbarModule,
    Layout,
    DxNumberBoxModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxiColumnModule,
    DxCheckBoxModule,
    FontPicker,
    DxDateBoxModule,
  ],
  templateUrl: './custom-mau12.html',
})
export class CustomMau12 {
  readonly isLoading = signal<boolean>(false);
  readonly customService = inject(CustomService);
  customCauHinh: CauHinh = {
    setUpTrang: {
      khoGiay: 'A4',
      canLeTop: 15,
      canLeBottom: 15,
      canLeLeft: 20,
      canLeRight: 15,
    },
    header: {
      tenDonVi: {
        text: 'BHXH TỈNH/HUYỆN',
        fontFamily: 'Times New Roman',
        fontSize: 11,
        bold: true,
      },
      coSoChiTra: {
        text: 'BHXH cơ sở   Xã, phường, tổ chi trả: ',
        fontFamily: 'Times New Roman',
        fontSize: 11,
        italic: false,
      },
      thangNam: {
        thang: null as number | null,
        nam: null as number | null,
        fontFamily: 'Times New Roman',
        fontSize: 11,
        alignment: 'center',
      },
      hinhThucChiTra: {
        text: 'Hình thức chi trả:',
        fontFamily: 'Times New Roman',
        fontSize: 11,
      },
      nguonKinhPhi: {
        text: 'Nguồn kinh phí:',
        fontFamily: 'Times New Roman',
        fontSize: 11,
      },
    },

    grid: {
      headerRow: {
        fontFamily: 'Times New Roman',
        fontSize: 10,
        bold: true,
        alignment: 'center',
      },
      groupHeader: {
        fontFamily: 'Times New Roman',
        fontSize: 10,
        bold: true,
      },
      dataRow: {
        fontFamily: 'Times New Roman',
        fontSize: 10,
        bold: false,
      },
      summaryRow: {
        fontFamily: 'Times New Roman',
        fontSize: 10,
        bold: true,
      },
    },

    footer: {
      ngayThang: {
        fontFamily: 'Times New Roman',
        fontSize: 11,
        italic: true,
        alignment: 'right',
      },
      styleChungNguoiKy: {
        fontFamily: 'Times New Roman',
        fontSize: 11,
      },
      danhSachNguoiKy: [
        {
          id: 5,
          tenNguoiKy: 'Vũ Hoàng Sơn',
          hienThi: true,
        },
        {
          id: 1,
          tenNguoiKy: 'Vũ Hoàng Sơn',
          hienThi: true,
        },
      ],
    },
  };
  readonly thangOptions = Array.from({ length: 12 }, (_, index) => index + 1);
  readonly namOptions = Array.from(
    { length: 21 },
    (_, index) => new Date().getFullYear() - 10 + index,
  );
  readonly khoGiayOptions = [
    { value: 'A3', text: 'A3 (297 x 420 mm)' },
    { value: 'A4', text: 'A4 (210 x 297 mm) - Phổ biến' },
    { value: 'A5', text: 'A5 (148 x 210 mm) - Phiếu thu/chi' },
    { value: 'B4', text: 'B4 (250 x 353 mm)' },
    { value: 'B5', text: 'B5 (176 x 250 mm)' },
  ];

  nguoiKyList: { id: number; chucDanh: string; tieuDeNguoiKy: string }[] = [
    {
      id: 1,
      chucDanh: 'Giám đốc',
      tieuDeNguoiKy: 'Giám đốc',
    },
    {
      id: 2,
      chucDanh: 'Kế toán trưởng',
      tieuDeNguoiKy: 'Kế toán trưởng',
    },
    {
      id: 3,
      chucDanh: 'Thủ kho',
      tieuDeNguoiKy: 'Thủ kho',
    },
    {
      id: 4,
      chucDanh: 'Thủ quỹ',
      tieuDeNguoiKy: 'Thủ quỹ',
    },
    {
      id: 5,
      chucDanh: 'Người lập biểu',
      tieuDeNguoiKy: 'Người lập biểu',
    },
  ];
  isOpenNguoiKy = false;
  isOpenCustomFont = false;
  isOpenCustomGrid = false;

  tieuDeFont: FontStyleValue = {
    family: 'Times New Roman',
    size: 18,
    bold: true,
  };

  getHeaderFontStyle(style: TextStyle): FontStyleValue {
    return {
      family: style.fontFamily ?? 'Times New Roman',
      size: style.fontSize ?? 12,
      bold: style.bold ?? false,
      italic: style.italic ?? false,
      underline: style.underline ?? false,
    };
  }

  updateHeaderFontStyle(style: TextStyle, value: FontStyleValue) {
    style.fontFamily = value.family;
    style.fontSize = value.size;
    style.bold = value.bold;
    style.italic = value.italic;
    style.underline = value.underline;
  }

  getTableFontStyle(style: TextStyle): FontStyleValue {
    return {
      family: style.fontFamily ?? 'Times New Roman',
      size: style.fontSize ?? 12,
      bold: style.bold ?? false,
      italic: style.italic ?? false,
      underline: style.underline ?? false,
    };
  }

  updateTableFontStyle(style: TextStyle, value: FontStyleValue) {
    style.fontFamily = value.family;
    style.fontSize = value.size;
    style.bold = value.bold;
    style.italic = value.italic;
    style.underline = value.underline;
  }

  toggleNguoiKy() {
    this.isOpenNguoiKy = !this.isOpenNguoiKy;
  }
  toggleCustomFont() {
    this.isOpenCustomFont = !this.isOpenCustomFont;
  }
  toggleCustomGrid() {
    this.isOpenCustomGrid = !this.isOpenCustomGrid;
  }
  getTenNguoiKy(id: number) {
    const item = this.customCauHinh.footer.danhSachNguoiKy.find((item) => item.id === id);

    return item?.tenNguoiKy ?? '';
  }

  getHienThiNguoiKy(id: number) {
    return (
      this.customCauHinh.footer.danhSachNguoiKy.find((item) => item.id === id)?.hienThi ?? false
    );
  }

  updateTenNguoiKy(id: number, event: any) {
    const tenNguoiKy = event.target.value;
    if (tenNguoiKy.trim() === '') {
      this.getOrCreateNguoiKy(id).hienThi = false;
    } else {
      this.getOrCreateNguoiKy(id).tenNguoiKy = tenNguoiKy;
      this.getOrCreateNguoiKy(id).hienThi = true;
    }
  }

  updateHienThiNguoiKy(id: number, hienThi: boolean) {
    this.getOrCreateNguoiKy(id).hienThi = hienThi;
  }

  private getOrCreateNguoiKy(id: number) {
    let item = this.customCauHinh.footer.danhSachNguoiKy.find((nguoiKy) => nguoiKy.id === id);

    if (!item) {
      item = { id, tenNguoiKy: '', hienThi: true };
      this.customCauHinh.footer.danhSachNguoiKy.push(item);
    }
    return item;
  }
  onSave(): void {
    this.customService.saveCustomMau12(this.customCauHinh);
  }
}
