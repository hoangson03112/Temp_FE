import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Layout } from '../../layout/layout';
import { ToastService } from '../../core/services/toast.service';
import { LayoutService } from '../../core/services/layout.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Mau12Service } from '../../core/services/mau12.service';
import { DxLoadPanelModule, DxPopupModule } from 'devextreme-angular';

@Component({
  standalone: true,
  imports: [Layout, RouterLink, DxPopupModule, DxLoadPanelModule],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {
  private readonly _mau12Service = inject(Mau12Service);
  private _toastService = inject(ToastService);
  protected layoutService = inject(LayoutService);
  readonly isLoading = signal(false);
  readonly pdfSafeUrl = signal<SafeResourceUrl | null>(null);
  readonly pdfDirectUrl = signal<string | null>(null);
  readonly isPdfPreviewOpen = signal(false);
  private readonly sanitizer = inject(DomSanitizer);

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }
  openMau12Preview(): void {
    this._mau12Service.exportMau12().subscribe({
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
    this._mau12Service.exportMau12().subscribe({
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
}
