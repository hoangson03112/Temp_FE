import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toPascalCase } from '../../shared/utils/string.util';
import { PaginatedResult } from '../../shared/types/ApiRespone.type';
import { ApiResponse } from '../../shared/models/api-response.model';
import { Category, CategoryQueryParams, CreateCategory, UpdateCategory } from './Category.type';

@Injectable({ providedIn: 'root' })
export class CateService {
  private readonly base = `${environment.apiBaseUrl}/api`;
  private readonly http = inject(HttpClient);

  private _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  setCategories(categories: Category[]): void {
    this._categories.set(categories);
  }

  getCategories(
    queryParams: CategoryQueryParams,
  ): Observable<ApiResponse<PaginatedResult<Category>>> {
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
    return this.http.get<ApiResponse<PaginatedResult<Category>>>(`${this.base}/danh-muc`, {
      params,
    });
  }

  createCategory(body: CreateCategory): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.base}/danh-muc`, body);
  }

  updateCategory(maDm: string, body: UpdateCategory): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.base}/danh-muc/${maDm}`, body);
  }

  deleteCategory(maDm: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.base}/danh-muc/${maDm}`);
  }
}
