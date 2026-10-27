import { Component, inject, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import {
  DxToolbarModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxLoadPanelModule,
  DxToastModule,
} from 'devextreme-angular';
import { CustomStore } from 'devextreme/common/data';
import { confirm } from 'devextreme/ui/dialog';
import { ProductService, ProductQueryParams } from './service/product.service';
import { Layout } from '../../layout/layout';
import { Popup } from './components/popup/popup';
import { ToastService } from '../../core/services/toast.service';
import { SelectComponent } from '../../shared/components/select-component/select-component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    Layout,
    Popup,
    DxToolbarModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxLoadPanelModule,
    DxToastModule,
    SelectComponent,
  ],
  templateUrl: './product.html',
})
export class ProductListComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;

  private readonly _productService = inject(ProductService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly _toastService = inject(ToastService);
  readonly isFilterOpen = signal(true);
  readonly isDrawerOpen = signal(false);
  readonly isPdfPreviewOpen = signal(false);
  readonly isLoading = signal(false);

  readonly totalProducts = signal(0);
  readonly activeProducts = signal(0);
  readonly lowStockProducts = signal(0);
  readonly pdfSafeUrl = signal<SafeResourceUrl | null>(null);
  readonly pdfDirectUrl = signal<string | null>(null);

  isCrudPopupVisible = false;
  crudPopupMode: 'add' | 'edit' = 'add';
  selectedProduct: any = {};

  filterKeyword = '';
  filterStatus: number | null = null;
  filterMinPrice = 0;
  filterMaxPrice = 0;
  filterIsAscending = true;
  filterPageSize = 10;

  readonly statusFilterOptions = [
    { value: null, text: 'Tất cả trạng thái' },
    { value: 1, text: 'Đang bán' },
    { value: 0, text: 'Ngừng bán' },
  ];

  readonly sortByOptions = [
    { value: 'maSp', text: 'Mã sản phẩm (ID)' },
    { value: 'tenSp', text: 'Tên sản phẩm' },
    { value: 'giaBan', text: 'Giá bán' },
    { value: 'soLuong', text: 'Số lượng tồn kho' },
  ];

  readonly sortOrderOptions = [
    { value: true, text: 'Tăng dần (A → Z)' },
    { value: false, text: 'Giảm dần (Z → A)' },
  ];

  readonly pageSizeOptions = [
    { value: 10, text: '10 dòng / trang' },
    { value: 20, text: '20 dòng / trang' },
    { value: 50, text: '50 dòng / trang' },
    { value: 100, text: '100 dòng / trang' },
  ];

  readonly dataSource: CustomStore;

  readonly debugJson = computed(() => {
    return JSON.stringify(
      {
        endpoint: '/api/san-pham',
        pdfEndpoint: '/api/san-pham/export-pdf',
        filters: {
          keyword: this.filterKeyword || null,
          trangThai: this.filterStatus,
          minPrice: this.filterMinPrice,
          maxPrice: this.filterMaxPrice,
          isAscending: this.filterIsAscending,
          pageSize: this.filterPageSize,
        },
        stats: {
          totalProducts: this.totalProducts(),
          activeProducts: this.activeProducts(),
          lowStockProducts: this.lowStockProducts(),
        },
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    );
  });

  constructor() {
    this.dataSource = new CustomStore({
      key: 'maSp',
      load: async (loadOptions: any) => {
        this.isLoading.set(true);

        const pageIndex =
          Math.floor((loadOptions.skip || 0) / (loadOptions.take || this.filterPageSize)) + 1;
        const pageSize = loadOptions.take || this.filterPageSize;
        console.log(pageIndex);

        let keyword = this.filterKeyword;
        if (loadOptions.searchValue) {
          keyword = loadOptions.searchValue;
        }

        let isAscending = this.filterIsAscending;
        if (loadOptions.sort && loadOptions.sort.length > 0) {
          isAscending = !loadOptions.sort[0].desc;
        }

        const queryParams: ProductQueryParams = {
          pageIndex,
          pageSize,
          keyword: keyword?.trim() || undefined,
          isAscending,
          trangThai: this.filterStatus !== null ? this.filterStatus : undefined,
          minPrice: this.filterMinPrice > 0 ? this.filterMinPrice : undefined,
          maxPrice: this.filterMaxPrice > 0 ? this.filterMaxPrice : undefined,
        };

        try {
          const response: any = await firstValueFrom(this._productService.getProducts(queryParams));

          const items: any[] = response?.data?.items || [];
          const total: number = response?.data?.total || 0;

          this.totalProducts.set(total);
          const activeCount = items.filter((p: any) => p.trangThai === 1).length;
          const lowStockCount = items.filter((p: any) => p.soLuong <= 10).length;
          this.activeProducts.set(activeCount);
          this.lowStockProducts.set(lowStockCount);

          this.isLoading.set(false);

          return {
            data: items,
            totalCount: total,
          };
        } catch (error) {
          this.isLoading.set(false);
          this._toastService.show('Không thể tải dữ liệu từ máy chủ backend.', 'error');
          throw new Error('Lỗi tải dữ liệu');
        }
      },
    });
  }

  toggleFilter(): void {
    this.isFilterOpen.update((v) => !v);
  }

  toggleDrawer(): void {
    this.isDrawerOpen.update((v) => !v);
  }

  closeDrawer(): void {
    this.isDrawerOpen.set(false);
  }

  applyFilter(): void {
    this.dataGrid?.instance.refresh();
    this._toastService.show('Đã áp dụng các tiêu chí lọc dữ liệu.', 'info');
  }

  resetFilter(): void {
    this.filterKeyword = '';
    this.filterStatus = null;
    this.filterMinPrice = 0;
    this.filterMaxPrice = 0;
    this.filterIsAscending = true;
    this.filterPageSize = 10;
    this.dataGrid?.instance.refresh();
    this._toastService.show('Đã đặt lại bộ lọc mặc định.', 'info');
  }

  refresh(): void {
    this.dataGrid?.instance.refresh();
    this._toastService.show('Đã làm mới danh sách sản phẩm.', 'success');
  }

  openPdfPreview(): void {
    this.isLoading.set(true);
    this._productService.exportPdf().subscribe({
      next: (blob: Blob) => {
        this.isLoading.set(false);
        if (blob.type === 'application/json') {
          blob.text().then((text) => console.error('Lỗi server:', text));
          this._toastService.show('Lỗi khi kết xuất PDF từ hệ thống.', 'error');
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        this.pdfDirectUrl.set(blobUrl);
        this.pdfSafeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
        this.isPdfPreviewOpen.set(true);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Lỗi xuất PDF:', err);
        this._toastService.show(
          'Không thể kết xuất báo cáo PDF. Vui lòng kiểm tra backend.',
          'error',
        );
      },
    });
  }

  closePdfPreview(): void {
    this.isPdfPreviewOpen.set(false);
  }

  triggerPrintPdf(): void {
    const iframe = document.querySelector('#productPdfFrame') as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        return;
      } catch {}
    }
    const url = this.pdfDirectUrl();
    if (url) window.open(url, '_blank');
  }

  downloadPdfDirectly(): void {
    this.isLoading.set(true);
    this._productService.exportPdf().subscribe({
      next: (blob) => {
        this.isLoading.set(false);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `DanhSachSanPham_${new Date().toISOString().slice(0, 10)}.pdf`;
        link.click();
        setTimeout(() => {
          link.remove();
          window.URL.revokeObjectURL(url);
        }, 2000);
        this._toastService.show('Đã tải xuống file PDF thành công!', 'success');
      },
      error: (err) => {
        this.isLoading.set(false);
        this._toastService.show('Lỗi khi tải file PDF từ máy chủ.', 'error');
      },
    });
  }

  openPdfInNewTab(): void {
    const url = this.pdfDirectUrl();
    if (url) {
      window.open(url, '_blank');
    } else {
      this.downloadPdfDirectly();
    }
  }

  openAddPopup(): void {
    this.crudPopupMode = 'add';
    this.selectedProduct = { tenSp: '', giaBan: 0, soLuong: 0 };
    this.isCrudPopupVisible = true;
  }

  openEditPopup(product: any): void {
    this.crudPopupMode = 'edit';
    this.selectedProduct = { ...product };
    this.isCrudPopupVisible = true;
  }

  saveProduct(): void {
    if (!this.selectedProduct.tenSp || !this.selectedProduct.tenSp.trim()) {
      this._toastService.show('Tên sản phẩm không được để trống!', 'warning');
      return;
    }

    const payload = {
      tenSp: this.selectedProduct.tenSp.trim(),
      giaBan: Number(this.selectedProduct.giaBan) || 0,
      soLuong: Number(this.selectedProduct.soLuong) || 0,
    };

    this.isLoading.set(true);

    if (this.crudPopupMode === 'add') {
      this._productService.createProduct(payload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this._toastService.show('Thêm mới sản phẩm thành công!', 'success');
          this.closeCrudPopup();
          this.dataGrid?.instance.refresh();
        },
        error: (err) => {
          this.isLoading.set(false);
          this._toastService.show(err?.error?.message || 'Có lỗi khi thêm sản phẩm mới', 'error');
        },
      });
    } else {
      this._productService.updateProduct(this.selectedProduct.maSp, payload).subscribe({
        next: () => {
          this.isLoading.set(false);
          this._toastService.show('Cập nhật sản phẩm thành công!', 'success');
          this.closeCrudPopup();
          this.dataGrid?.instance.refresh();
        },
        error: (err) => {
          this.isLoading.set(false);
          this._toastService.show(err?.error?.message || 'Có lỗi khi cập nhật sản phẩm', 'error');
        },
      });
    }
  }

  onDeleteProduct(product: any): void {
    confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm "${product.tenSp}" (Mã: ${product.maSp})?`,
      'Xác nhận xóa',
    ).then((dialogResult) => {
      if (dialogResult) {
        this.isLoading.set(true);
        this._productService.deleteProduct(product.maSp).subscribe({
          next: () => {
            this.isLoading.set(false);
            this._toastService.show(`Đã xóa sản phẩm "${product.tenSp}" thành công!`, 'success');
            this.dataGrid?.instance.refresh();
          },
          error: (err) => {
            this.isLoading.set(false);
            this._toastService.show(err?.error?.message || 'Có lỗi khi xóa sản phẩm', 'error');
          },
        });
      }
    });
  }

  closeCrudPopup(): void {
    this.isCrudPopupVisible = false;
    this.selectedProduct = { tenSp: '', giaBan: 0, soLuong: 0 };
  }

  copyDebugJson(): void {
    navigator.clipboard.writeText(this.debugJson()).then(() => {
      this._toastService.show('Đã sao chép dữ liệu cấu hình vào bộ nhớ tạm!', 'success');
    });
  }
}
