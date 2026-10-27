import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public isOpenSidebar = signal<boolean>(true);

  toggleSidebar() {
    this.isOpenSidebar.set(!this.isOpenSidebar());
  }
}
