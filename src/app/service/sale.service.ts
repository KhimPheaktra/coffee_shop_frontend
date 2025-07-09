import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment.prod';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) {}
  getSale() {
    return this.http.get(environment.apiEndPoint + 'api/Sale', {
    withCredentials: true,
    }).pipe(
        catchError(err => {
          return throwError(() => new Error('Session expired. Please log in again.'));
        }));
  }
  addSale(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/Sale/add-sale',
        data, {
      withCredentials: true
    }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }
}
