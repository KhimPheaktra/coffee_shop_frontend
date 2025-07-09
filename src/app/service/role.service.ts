import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment.prod';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  getRoleList() {
    return this.http.get(environment.apiEndPoint + 'api/Role', {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }
  getRoleById(data: any){
    return this.http.post(environment.apiEndPoint + 'api/get-role-by-id',data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }
  addRole(data: any){
    return this.http.post(environment.apiEndPoint + 'api/add-role',data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }
  editRole(data: any){
    return this.http.post(environment.apiEndPoint + 'api/edit-role',data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }
  deleteRole(data: any){
    return this.http.post(environment.apiEndPoint + 'api/delete-role',data, {
    withCredentials: true
  }).pipe(
    catchError(err => {
      return throwError(() => new Error('Session expired. Please log in again.'));
    }));
  }
}
