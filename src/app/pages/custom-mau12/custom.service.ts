import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { CauHinh } from './custome.type';

@Injectable({ providedIn: 'root' })
export class CustomService {
  private readonly base = `${environment.apiBaseUrl}/api`;
  private readonly http = inject(HttpClient);

  saveCustomMau12(body: CauHinh): Observable<Blob> {
    return this.http.put(`${this.base}/bao-cao/custom/mau-12-cbh`, body, {
      responseType: 'blob',
    });
  }
}
