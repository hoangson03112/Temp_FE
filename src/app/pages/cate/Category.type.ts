export interface Category {
  maDm?: string;
  tenDm?: string;
  trangThai?: number;
  moTa?: string;
}

export interface CategoryQueryParams {
  pageIndex?: number;
  pageSize?: number;
}

export interface CreateCategory {
  tenDm: string;
  moTa?: string;
}

export interface UpdateCategory {
  tenDm: string;
  moTa?: string;
  trangThai: number;
}
