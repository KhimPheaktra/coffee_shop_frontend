import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment';
import { UserResponse } from '../components/admin/user/user.component';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  getAllUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(environment.apiEndPoint + 'api/User', {
    withCredentials: true
  });
  }
  getUserById(data: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(environment.apiEndPoint + 'api/User/api/get-user-by-id',data, {
    withCredentials: true
  })
  }
  addUser(data: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(environment.apiEndPoint + 'api/User/add-user',data, {
    withCredentials: true
  });
  }
  editUser(data: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(environment.apiEndPoint + 'api/User/api/edit-user',data, {
    withCredentials: true
  });
  }
  deleteUser(data: any): Observable<UserResponse>  {
    return this.http.post<UserResponse>(environment.apiEndPoint + 'api/User/api/delete-user',data, {
    withCredentials: true
  });
  }


}
