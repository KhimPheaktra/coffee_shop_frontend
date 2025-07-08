import { environment } from '../components/environments/environment';

export class AppService {
  apiurl = environment.apiEndPoint;

  constructor() {
    console.log('API URL:', this.apiurl);
  }
}
