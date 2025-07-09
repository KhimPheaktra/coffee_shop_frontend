import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  getRoleList() {
    return this.http.get(environment.apiEndPoint + 'api/Role', {
    withCredentials: true
  });
  }
  getRoleById(data: any){
    return this.http.post(environment.apiEndPoint + 'api/get-role-by-id',data, {
    withCredentials: true
  })
  }
  addRole(data: any){
    return this.http.post(environment.apiEndPoint + 'api/add-role',data, {
    withCredentials: true
  })
  }
  editRole(data: any){
    return this.http.post(environment.apiEndPoint + 'api/edit-role',data, {
    withCredentials: true
  })
  }
  deleteRole(data: any){
    return this.http.post(environment.apiEndPoint + 'api/delete-role',data, {
    withCredentials: true
  })
  }
}
