import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxLoadPanelModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { CustomStore } from 'devextreme/common/data';
import { confirm } from 'devextreme/ui/dialog';
import { firstValueFrom } from 'rxjs';
import { Layout } from '../../layout/layout';
import { ToastService } from '../../core/services/toast.service';
import { CateService } from './cate.service';
import { Category, CategoryQueryParams, CreateCategory, UpdateCategory } from './Category.type';
import { PopupCate } from './components/popup/popup';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    Layout,
    PopupCate,
    DxToolbarModule,
    DxButtonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxDataGridModule,
    DxLoadPanelModule,
  ],
  selector: 'app-cate',
  templateUrl: './cate.html',
})
export class Cate {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;

  private readonly _cateService = inject(CateService);
  private readonly _toastService = inject(ToastService);

  readonly isLoading = signal(false);
  readonly totalCategories = signal(0);
  readonly filterPageSize = 10;

  isCrudPopupVisible = false;
  crudPopupMode: 'add' | 'edit' = 'add';
  selectedCategory: Category = {};

  readonly dataSource: CustomStore;

  constructor() {
    this.dataSource = new CustomStore({
      key: 'maDm',
      load: async (loadOptions: any) => {
        this.isLoading.set(true);

        const take = loadOptions.take || this.filterPageSize;
        const pageIndex = Math.floor((loadOptions.skip || 0) / take) + 1;
        const pageSize = take;

        const queryParams: CategoryQueryParams = {
          pageIndex,
          pageSize,
        };

        try {
          const response: any = await firstValueFrom(this._cateService.getCategories(queryParams));
          const items: any[] = response?.data?.items || [];
          const total: number = response?.data?.total || 0;

          this.totalCategories.set(total);
          this.isLoading.set(false);

          return {
            data: items,
            totalCount: total,
          };
        } catch (error) {
          this.isLoading.set(false);
          this._toastService.show('Không thể tải dữ liệu danh mục từ máy chủ backend.', 'error');
          throw new Error('Lỗi tải dữ liệu');
        }
      },
    });
  }

  refresh(): void {
    this.dataGrid?.instance.refresh();
    this._toastService.show('Đã làm mới danh sách danh mục.', 'success');
  }

  openAddPopup(): void {
    this.crudPopupMode = 'add';
    this.selectedCategory = { tenDm: '', moTa: '', trangThai: 1 };
    this.isCrudPopupVisible = true;
  }

  openEditPopup(cate: Category): void {
    this.crudPopupMode = 'edit';
    this.selectedCategory = { ...cate };
    this.isCrudPopupVisible = true;
  }

  saveCate(): void {
    if (!this.selectedCategory.tenDm || !this.selectedCategory.tenDm.trim()) {
      this._toastService.show('Tên danh mục không được để trống!', 'warning');
      return;
    }

    this.isLoading.set(true);

    if (this.crudPopupMode === 'add') {
      const createPayload: CreateCategory = {
        tenDm: this.selectedCategory.tenDm.trim(),
        moTa: this.selectedCategory.moTa?.trim() || undefined,
      };

      this._cateService.createCategory(createPayload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this._toastService.show('Thêm mới danh mục thành công!', 'success');
          this.closeCrudPopup();
          this.dataGrid?.instance.refresh();
        },
        error: (err: any) => {
          this.isLoading.set(false);
          this._toastService.show(err?.error?.message || 'Có lỗi khi thêm danh mục mới.', 'error');
        },
      });
    } else {
      const updatePayload: UpdateCategory = {
        tenDm: this.selectedCategory.tenDm.trim(),
        moTa: this.selectedCategory.moTa?.trim() || undefined,
        trangThai: this.selectedCategory.trangThai ?? 1,
      };

      this._cateService.updateCategory(this.selectedCategory.maDm!, updatePayload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this._toastService.show('Cập nhật danh mục thành công!', 'success');
          this.closeCrudPopup();
          this.dataGrid?.instance.refresh();
        },
        error: (err: any) => {
          this.isLoading.set(false);
          this._toastService.show(err?.error?.message || 'Có lỗi khi cập nhật danh mục.', 'error');
        },
      });
    }
  }

  onDeleteCategory(cate: Category): void {
    if (!cate.maDm) return;

    confirm(
      `Bạn có chắc chắn muốn xóa danh mục "${cate.tenDm}" (Mã: ${cate.maDm})?`,
      'Xác nhận xóa',
    ).then((dialogResult) => {
      if (dialogResult) {
        this.isLoading.set(true);
        this._cateService.deleteCategory(cate.maDm!).subscribe({
          next: () => {
            this.isLoading.set(false);
            this._toastService.show(`Đã xóa danh mục "${cate.tenDm}" thành công!`, 'success');
            this.dataGrid?.instance.refresh();
          },
          error: (err: any) => {
            this.isLoading.set(false);
            this._toastService.show(err?.error?.message || 'Có lỗi khi xóa danh mục.', 'error');
          },
        });
      }
    });
  }

  closeCrudPopup(): void {
    this.isCrudPopupVisible = false;
    this.selectedCategory = {};
  }
}
