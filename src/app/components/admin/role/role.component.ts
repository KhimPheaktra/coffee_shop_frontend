import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../../service/role.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../service/toast.service';
import { AccountService } from '../../../service/account.service';
import { ActivatedRoute } from '@angular/router';
import { SearchComponent } from "../../features/search/search.component";
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [HttpClientModule, CommonModule, DataTablesModule, FormsModule, SearchComponent,NgxPaginationModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})

export class RoleComponent implements OnInit {
  
  roleList: any[] = [];

  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnDelete: boolean = false;

  roleId = 0
  roleName = ""
  createBy = 0
  createDate = ""
  
  userName: string = "";
  page: number = 1;
  searchText = "";
  sortDirection: 'asc' | 'desc' = 'asc';
  filteredRole: any[]= [];
  constructor(private roleService: RoleService,private toastService: ToastService,private accountService: AccountService,private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.getRoleList();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchText = params['search'] || '';
      this.page = Number(params['page']);

      this.filterRoles(this.searchText);
    });
  

  }

  sortById() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.roleList.sort((a, b) => {
      return this.sortDirection === 'desc'
        ? b.roleId - a.roleId
        : a.roleId - b.roleId;
    });
    this.filteredRole = this.roleList;
  }
  

  filterRoles(searchText: string) {
  if (!searchText?.trim()) {
    this.filteredRole = this.roleList;
  } else {
    const lowerSearch = searchText.toLowerCase().trim();
    this.filteredRole = this.roleList.filter((role: { roleName: string }) =>
      role.roleName.toLowerCase().includes(lowerSearch)
    );
  }
}


  getRoleList() {
    this.roleService.getRoleList().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.roleList = res.roleList;
        this.filteredRole = this.roleList;
      }
    });
  }

  ResetForm(){
    this.roleId = 0
    this.roleName = ""
    this.createBy = 0
    this.createDate = ""
  }
  AddNew() :void{
    this.VisibleCRUButton("C");
  }
  VisibleCRUButton(evName: string){
    this.btnSave = evName === "C";
    this.btnEdit = evName === "E";
    this.btnDelete = evName === "D";
    this.ResetForm();
  }
  ViewRole(roleId: any,evName: string){
    this.VisibleCRUButton(evName);
    let data = {
      roleId : roleId
    }
    this.roleService.getRoleById(data).subscribe((res: any)=>{
      if(res.status === 'Succeed'){
        this.roleId = res.roleList[0].roleId;
        this.roleName = res.roleList[0].roleName;
        this.createBy = res.rolelist[0].createBy;
        this.createDate = res.createDate[0].createDate;
      }
    })
  }
  AddRole(){
    const decodedToken = this.accountService.decodeToken();
    const userId = decodedToken?.userId || decodedToken?.userId || null;
  
    let data = {
      roleId : this.roleId,
      roleName : this.roleName,
      createBy : userId,
      createDate : new Date().toISOString(),
    }
     this.roleService.addRole(data).subscribe((res: any)=>{
      if(res.status === "Succeed"){
        this.getRoleList();
        document.getElementById('close')?.click();
        this.toastService.doToastInfo('Add Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');

      }
     });
  }
  editRole(){
    let data = {
      roleId : this.roleId,
      roleName : this.roleName,
      createBy : this.createBy,
      createDate : new Date().toISOString(),
    }
    this.roleService.editRole(data).subscribe((res: any)=>{
      if(res.status === "Succeed"){
        this.getRoleList();
        document.getElementById('close')?.click();
        this.toastService.doToastInfo('Edit Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');
      }
    });
  }
  DeleteRole(roleId: any){
    let data = {
      roleId : roleId,
    }
    this.roleService.deleteRole(data).subscribe((res: any)=> {
      if(res.status === "Succeed"){
        this.getRoleList();
        document.getElementById('close')?.click();
        this.toastService.doToastInfo('Delete Succeed', 'Information', 'Succeed');
      }
      else{
        this.toastService.doToastInfo('Something when wrong', 'Information', 'Error');

      }
    })
  }
}
