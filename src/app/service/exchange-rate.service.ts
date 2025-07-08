import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../components/environments/environment';
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
  });
  }
  getExchangeRateById(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/ExchangeRate/get-exchange-by-id',
      data, {
      withCredentials: true
    });
  }
  editExchangeRate(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/ExchangeRate/edit-exchange-rate',
      data, {
    withCredentials: true
  });
  }
  deleteExchnageRate(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/ExchangeRate/delete-exchange',
      data, {
    withCredentials: true
  });
  }
}
