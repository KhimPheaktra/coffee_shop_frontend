import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { environment } from '../components/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  httpClient: any;
  public search = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {}
  getProduct() {
    return this.http.get(environment.apiEndPoint + 'api/Product', {
    withCredentials: true
  });
  }
  getProductById(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/get-product-by-id',data, {
    withCredentials: true
  });
  }
  addProduct(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/add-product', data, {
    withCredentials: true
  });
  }
  editProduct(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/edit-product', data, {
    withCredentials: true
  });
  }
  deleteProduct(data: any) {return this.http.post(environment.apiEndPoint + 'api/delete-product',data, {
    withCredentials: true
  });
}
}
