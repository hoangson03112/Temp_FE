import { Component, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import CustomStore from 'devextreme/data/custom_store';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { DataSource } from 'devextreme/common/data';

@Component({
  selector: 'app-select',
  templateUrl: './select-component.html',
  standalone: true,
  imports: [DxSelectBoxModule, DxTemplateModule],
})
export class SelectComponent {
  selectBoxDataSource: DataSource;
  selectedId: number | null = null;
  private readonly base = `${environment.apiBaseUrl}/api`;
  private readonly http = inject(HttpClient);
  constructor() {
    const store = new CustomStore({
      key: 'id',
      load: async (loadOptions) => {
        let params: HttpParams = new HttpParams()
          .set('skip', loadOptions.skip || 0)
          .set('take', loadOptions.take || 20);

        if (loadOptions.searchValue) {
          params = params.set('search', loadOptions.searchValue.toString());
        }

        const response = await lastValueFrom(
          this.http.get<{ data: { items: any[]; total: number } }>(`${this.base}/item`, { params }),
        );

        return {
          data: response.data.items,
          totalCount: response.data.total,
        };
      },

      byKey: (key) => {
        return lastValueFrom(this.http.get<any>(`${this.base}/item/${key}`));
      },
    });
    this.selectBoxDataSource = new DataSource({
      store,
      paginate: true,
      pageSize: 20,
    });
  }
  displayFn = (item: any) => (item ? `${item.ma} - ${item.ten}` : '');

  dropDownOptions = {
    width: 400,
    wrapperAttr: {
      class: [
        '[&_.dx-list-item-content]:!p-0',
        '[&_.dx-list-item]:border-b',
        '[&_.dx-list-item]:border-gray-200',
        '[&_.dx-list-item:nth-child(even)]:bg-gray-50',
        '[&_.dx-list-item.dx-state-hover]:!bg-blue-50',
        '[&_.dx-list-item-selected]:!bg-blue-100',
      ].join(' '),
    },
  };
  onOpened(e: any) {
    const content: HTMLElement = e.component.content();
    if (content.querySelector('.select-thead')) return;

    const header = document.createElement('div');
    header.className =
      'select-thead grid grid-cols-[120px_1fr] bg-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-300 pr-4';
    header.innerHTML = `
    <span class="px-3 py-2.5 border-r border-gray-200">Mã</span>
    <span class="px-3 py-2.5">Tên</span>`;
    content.prepend(header);
  }
}
