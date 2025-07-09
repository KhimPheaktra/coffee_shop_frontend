import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from '../components/environments/environment.prod';
interface ExchangeRate {
  rate: number;
}
@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  constructor(private http: HttpClient) {}

  getExchangeRate(): Observable<number> {
    return this.http.get<number>(environment.apiEndPoint + 'api/ExchangeRate', {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to get exchange'));
    }));
  }
  getExchangeRateById(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/ExchangeRate/get-exchange-by-id',
      data, {
      withCredentials: true
    }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to get exchange'));
    }));
  }
  
  addExchangeRate(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/ExchangeRate/add-exchange-rate',
      data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to add exchange'));
    }));
  }

  editExchangeRate(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/ExchangeRate/edit-exchange-rate',
      data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to udpate exchange'));
    }));
  }
  deleteExchnageRate(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/ExchangeRate/delete-exchange',
      data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to delete exchange'));
    }));
  }
}
