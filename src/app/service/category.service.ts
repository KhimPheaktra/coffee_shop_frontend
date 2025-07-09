import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment.prod';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategory() {
    return this.http.get(environment.apiEndPoint + 'api/Category', {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Get category failed'));
    }));
  }
  getCategoryById(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/get-category-by-id',
      data, {
      withCredentials: true
    }).pipe(
    catchError(err => {
      return throwError(() => new Error('Get category failed'));
    }));
  }
  addCategory(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/add-category', data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to add category'));
    }));
  }
  editCategory(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/edit-category', data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to update category'));
    }));
  }
  deleteCategory(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/delete-category',
      data,
       {
      withCredentials: true
    }).pipe(
    catchError(err => {
      return throwError(() => new Error('Failed to delete category'));
    }));
  }
}
