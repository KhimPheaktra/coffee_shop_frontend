import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategory() {
    return this.http.get(environment.apiEndPoint + 'api/Category', {
    withCredentials: true
  });
  }
  getCategoryById(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/get-category-by-id',
      data, {
      withCredentials: true
    });
  }
  addCategory(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/add-category', data, {
    withCredentials: true
  });
  }
  editCategory(data: any) {
    return this.http.post(environment.apiEndPoint + 'api/edit-category', data, {
    withCredentials: true
  });
  }
  deleteCategory(data: any) {
    return this.http.post(
      environment.apiEndPoint + 'api/delete-category',
      data,
       {
      withCredentials: true
    });
  }
}
