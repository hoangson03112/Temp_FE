import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Mau12Service {
  private readonly base = `${environment.apiBaseUrl}/api`;
  private readonly http = inject(HttpClient);
  exportMau12(): Observable<Blob> {
    return this.http.get(`${this.base}/bao-cao/export-mau12-cbh`, { responseType: 'blob' });
  }
}
