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
  underline?: boolean;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
}
export interface PageHeaderStyle extends TextStyle {
  text: string;
}
export interface ThangNamStyle extends TextStyle {
  thang: number | null;
  nam: number | null;
}
export interface CauHinh {
  setUpTrang: SetUpTrang;
  header: {
    tenDonVi: PageHeaderStyle;
    coSoChiTra: PageHeaderStyle;
    thangNam: ThangNamStyle;
    hinhThucChiTra: PageHeaderStyle;
    nguonKinhPhi: PageHeaderStyle;
  };
  grid: {
    headerRow: TextStyle;
    groupHeader: TextStyle;
    dataRow: TextStyle;
    summaryRow: TextStyle;
  };
  footer: {
    ngayThang: TextStyle;
    danhSachNguoiKy: NguoiKy[];
    styleChungNguoiKy?: TextStyle;
  };
}
