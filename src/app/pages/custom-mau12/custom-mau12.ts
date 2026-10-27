import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Thêm CommonModule nếu cần
import { FormsModule } from '@angular/forms'; // <--- QUAN TRỌNG: Thêm FormsModule để dùng [(ngModel)]
import {
  DxButtonModule,
  DxDataGridModule,
  DxLoadPanelModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { Layout } from '../../layout/layout';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';

export interface NguoiKy {
  id: number;
  tenNguoiKy: string;
  hienThi: boolean;
}
export interface SetUpTrang {
  khoGiay: string;
  canLeTop: number;
  canLeBottom: number;
  canLeLeft: number;
  canLeRight: number;
}
export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
}
export interface PageHeaderStyle extends TextStyle {
  text: string;
}
export interface CauHinh {
  setUpTrang: SetUpTrang;
  header: {
    tenDonVi: PageHeaderStyle;
    coSoChiTra: PageHeaderStyle;
    thang: PageHeaderStyle;
    nam: PageHeaderStyle;
    hinhThucChiTra: PageHeaderStyle;
    nguonKinhPhi: PageHeaderStyle;
  };
  grid: {
    headerRow: TextStyle;
    dataRow: TextStyle;
    summaryRow?: TextStyle;
  };
  footer: {
    ngayThang: TextStyle;
    danhSachNguoiKy: NguoiKy[];
    styleChungNguoiKy?: TextStyle;
  };
}

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
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxiColumnModule,
  ],
  templateUrl: './custom-mau12.html',
})
export class CustomMau12 {
  readonly isLoading = signal<boolean>(false);
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
        text: 'BHXH TỈNH/HUYỆN...',
        fontFamily: 'Times New Roman',
        fontSize: 11,
        bold: true,
      },
      coSoChiTra: {
        text: 'Xã, phường, tổ chi trả: ........................',
        fontFamily: 'Times New Roman',
        fontSize: 11,
        italic: false,
      },
      thang: {
        text: 'Tháng ..... năm .....',
        fontFamily: 'Times New Roman',
        fontSize: 11,
        alignment: 'center',
      },
      nam: {
        text: '',
        fontFamily: 'Times New Roman',
        fontSize: 11,
      },
      hinhThucChiTra: {
        text: 'Hình thức chi trả: ........................',
        fontFamily: 'Times New Roman',
        fontSize: 11,
      },
      nguonKinhPhi: {
        text: 'Nguồn kinh phí: ........................',
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

  isOpenTable = true;

  toggleTable() {
    this.isOpenTable = !this.isOpenTable;
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

  updateTenNguoiKy(id: number, tenNguoiKy: string) {
    this.getOrCreateNguoiKy(id).tenNguoiKy = tenNguoiKy;
  }

  updateHienThiNguoiKy(id: number, hienThi: boolean) {
    this.getOrCreateNguoiKy(id).hienThi = hienThi;
  }

  private getOrCreateNguoiKy(id: number) {
    let item = this.customCauHinh.footer.danhSachNguoiKy.find((nguoiKy) => nguoiKy.id === id);

    if (!item) {
      item = { id, tenNguoiKy: '', hienThi: false };
      this.customCauHinh.footer.danhSachNguoiKy.push(item);
    }

    return item;
  }
}
