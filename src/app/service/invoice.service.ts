import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment.prod';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  getInvoice(){
    return this.http.get(environment.apiEndPoint + 'api/Invoice', {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }))
  }
}
