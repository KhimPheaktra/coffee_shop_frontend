import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../components/environments/environment.prod';
import { Observable } from 'rxjs';
import { saleReport, saleReportResponse } from '../components/admin/sale-report/sale-report.component';

@Injectable({
  providedIn: 'root'
})
export class ShiftInfoService {

  constructor(private http:HttpClient) { }

  getReport(): Observable<saleReportResponse> {
    return this.http.get<saleReportResponse>(environment.apiEndPoint+ 'api/UserWorkInfo/get-report-sale', {
    withCredentials: true
  })
  }
  startWork(data: any): Observable<saleReportResponse> {
    return this.http.post<saleReportResponse>(environment.apiEndPoint+ 'api/UserWorkInfo/start-work',data, {
    withCredentials: true
  })
  }
  clockOut(data: any): Observable<saleReportResponse> {
    return this.http.post<saleReportResponse>(environment.apiEndPoint + 'api/UserWorkInfo/clockOut',data, {
    withCredentials: true
  })
  }
acctiveShift() {
  return this.http.get(environment.apiEndPoint + 'api/UserWorkInfo/active-session', {
    withCredentials: true
  });
}

}
