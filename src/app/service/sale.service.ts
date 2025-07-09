import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) {}
  getSale() {
    return this.http.get(environment.apiEndPoint + 'api/Sale', {
    withCredentials: true,
    });
  }
  addSale(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/Sale/add-sale',
        data, {
      withCredentials: true
    });
  }
}
