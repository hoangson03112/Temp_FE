import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { toPascalCase } from '../../../shared/utils/string.util';

export interface Product {
  maSp: string;
  tenSp: string;
  giaBan: number;
  soLuong: number;
  trangThai: string;
}

export interface ProductQueryParams {
  minPrice?: number;
  maxPrice?: number;
  trangThai?: number;
  keyword?: string;
  isAscending?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly base = `${environment.apiBaseUrl}/api`;
  private readonly http = inject(HttpClient);
  readonly toastMessage = signal<string | null>(null);
  readonly toastType = signal<'success' | 'info' | 'warning' | 'error'>('success');

  private readonly _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  setProducts(products: Product[]): void {
    this._products.set(products);
  }

  getProducts(queryParams?: ProductQueryParams): Observable<any> {
    let params = new HttpParams();

    if (queryParams) {
      Object.keys(queryParams).forEach((key) => {
        const value = (queryParams as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          const paramName = toPascalCase(key);
          params = params.set(paramName, value);
        }
      });
    }

    return this.http.get<any>(`${this.base}/san-pham`, { params });
  }

  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.base}/san-pham/export`, { responseType: 'blob' });
  }

  createProduct(data: { tenSp: string; giaBan: number; soLuong: number }): Observable<any> {
    return this.http.post<any>(`${this.base}/san-pham`, data);
  }
  updateProduct(
    maSp: string,
    data: { tenSp: string; giaBan: number; soLuong: number },
  ): Observable<any> {
    return this.http.put<any>(`${this.base}/san-pham/${maSp}`, data);
  }

  deleteProduct(maSp: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/san-pham/${maSp}`);
  }
}
