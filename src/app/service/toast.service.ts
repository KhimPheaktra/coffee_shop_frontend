import { Injectable } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastService: ToastrService) {}
  // doToast(status: string, message: string) {
  //   if (status === 'Succeed') {
  //     this.toastService.success(message, 'Information !');
  //   } else if (status === 'Error') {
  //     this.toastService.error(message, 'Information !');
  //   } else if (status === 'Info') {
  //     this.toastService.info(message, 'Information !');
  //   } else if (status === 'Warning') {
  //     this.toastService.warning(message, 'Information !');
  //   }
  // }

  // For Login Toast

  doToastInfo(message: string, title: string, status: string) {
    if (status === 'Succeed') {
      this.toastService.success(message, title);
    } else if (status === 'Error') {
      this.toastService.error(message, title);
    } else if (status === 'Info') {
      this.toastService.info(message, title);
    } else if (status === 'Warning') {
      this.toastService.warning(message, title);
    }
  }
}
