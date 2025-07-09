import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { environment } from '../components/environments/environment.prod';

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
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to get product'));
    }));
  }
  getProductById(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/get-product-by-id',data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to get product'));
    }));
  }
  addProduct(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/add-product', data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to add product'));
    }));
  }
  editProduct(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/edit-product', data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to update product'));
    }));
  }
  deleteProduct(data: any) {return this.http.post(environment.apiEndPoint + 'api/delete-product',data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to delete product'));
    }));
}
}
