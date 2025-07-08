import { Component, OnInit } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { AccountService } from '../../../service/account.service';
import { ToastService } from '../../../service/toast.service';
import { RoleService } from '../../../service/role.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';
import { SearchComponent } from "../../features/search/search.component";
export interface User {
  userId: number;
  userName: string;
  password: string;
  roleId: number;
  isActive: number;
  createBy: number;
  createDate: string;
  userProfile: string | null;
  profilePreview?: string | null;
}

export interface UserResponse {
  status: string; 
  userList: User[];
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [HttpClientModule, CommonModule, DataTablesModule, FormsModule, NgxPaginationModule, SearchComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})

export class UserComponent implements OnInit {
  
  userList: any[] = [];
  roleList: any[] = [];

  userId = 0;
  userName = "";
  password = "";
  newPassword = "";
  roleId = 0;
  isActive = 0;
  createBy = 0;
  createDate = "";
  userProfile: string | null = null;
  profilePreview: string | null = null;
  originalPassword: string = '';
  selectedProfile: any;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchText = "";
  
  btnSave: boolean = false;
  btnEdit: boolean = false;
  btnDelete: boolean = false;

  filteredUser: any[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService,
    private accountService: AccountService,
    private toastService: ToastService,
    private roleService: RoleService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getAllUsers();
    this.getRoleList();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchText = params['search'] || '';
      this.currentPage = Number(params['page']);

      this.filterUsers(this.searchText);
    });
  
  }

  sortById() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.userList.sort((a, b) => {
      return this.sortDirection === 'desc'
        ? b.userId - a.userId
        : a.userId - b.userId;
    });
    this.filteredUser = this.userList;
  }
  

filterUsers(searchText: string) {
  if (!searchText?.trim()) {
    this.filteredUser = this.userList;
  } else {
    const lowerSearch = searchText.toLowerCase().trim();
    this.filteredUser = this.userList.filter(
      (user: { userName: string }) =>
        user.userName.toLowerCase().includes(lowerSearch)
    );
  }
}



  getRoleList() {
    this.roleService.getRoleList().subscribe((res: any) => {
      if (res.status === 'Succeed') {
        this.roleList = res.roleList
      }
    });
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile = e.target.result;
        this.profilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  ResetForm(){
  this.userId = 0;
  this.userName = "";
  this.password = "";
  this.roleId = 0;
  this.isActive = 0;
  this.createBy = 0;
  this.createDate = "";
  this.userProfile = "";
  this.profilePreview = "";
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

  ViewUser(userId: any,evName: string){
    this.VisibleCRUButton(evName);
    this.userService.getUserById(userId).subscribe((res: UserResponse)=>{
      if(res.status === "Succeed"){
        this.userId = res.userList[0].userId;
        this.userName = res.userList[0].userName;
        this.roleId = res.userList[0].roleId;
        // this.password = res.userList[0].password;
        this.password = '';
        this.originalPassword = '';
        this.isActive = res.userList[0].isActive;
        this.createBy = res.userList[0].createBy;
        this.createDate = res.userList[0].createDate;
        this.userProfile = res.userList[0].userProfile;
      }
    })
    
  }

  getAllUsers() {
    this.userService.getAllUser().subscribe((res: UserResponse) => {
      if (res.status === 'Succeed') {
        this.userList = res.userList;
        this.filteredUser = this.userList;
      }
    });
  }
  
  AddUser() {
    // Ensure userProfile is assigned correctly
    this.userProfile = this.userProfile || this.selectedProfile?.userProfile || '';
    const decodedToken = this.accountService.decodeToken();
    const userId = decodedToken?.userId || decodedToken?.userId || '';
  
    let data = {
      userId: this.userId,
      userName: this.userName,
      roleId: this.roleId,
      password: this.password,
      createBy: userId,
      createDate: new Date().toISOString(),
      userProfile: this.userProfile, 
    };
  
    this.userService.addUser(data).subscribe((res: UserResponse) => {
      if (res.status === "Succeed") {
        this.getAllUsers();
        document.getElementById('close')?.click();
        this.toastService.doToastInfo("Add Succeed", "Information", "Succeed");
      } else {
        this.toastService.doToastInfo("Something went wrong", "Information", "Error");
      }
    });
  }
  
  EditUser(){
   const trimmedPassword = this.password?.trim();

    let data = {
      userId: this.userId,
      userName: this.userName,
      roleId: this.roleId,
      password: trimmedPassword && trimmedPassword.length > 0
      ? trimmedPassword
      : null, 
      createBy: this.createBy,
      createDate: this.createDate,
      userProfile: this.userProfile,
    };
    this.userService.editUser(data).subscribe((res: UserResponse) =>{
      if(res.status === "Succeed"){
        this.getAllUsers();
        document.getElementById('close')?.click();
        this.toastService.doToastInfo("Edit Succeed", "Information", "Succeed");
      } else {
        this.toastService.doToastInfo("Something went wrong", "Information", "Error");
      }
    })
  }

  DeleteUser(userId: any){
    let data = {
      userId: userId
    }
    this.userService.deleteUser(data).subscribe((res: UserResponse)=>{
      if(res.status === "Succeed"){
        this.getAllUsers();
        document.getElementById('close-delete-popup')?.click();
        this.toastService.doToastInfo("Delete Succeed", "Information", "Succeed");
      } else {
        this.toastService.doToastInfo("Something went wrong", "Information", "Error");
      }
    })
  }
}
