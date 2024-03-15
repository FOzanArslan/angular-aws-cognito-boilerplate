import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbarSub = new Subject<any>();
  public snackbarState = this.snackbarSub.asObservable();

  constructor() {}

  show(message: string, type: 'success' | 'danger' | 'info' | 'warning', duration: number = 0) {
    this.snackbarSub.next({
      show: true,
      message,
      type,
      duration
    });
  }
}
