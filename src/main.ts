import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';

import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { DatePipe } from '@angular/common';
import { provideToastr, ToastrModule } from 'ngx-toastr';

import { AppService } from './app/service/app.service';

import { AccountService } from './app/service/account.service';
import { authInterceptor } from './app/components/core/auth/auth.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideToastr(),
    provideNoopAnimations(),
    // provideHttpClient(
    //   // withFetch(),
    //   withInterceptors([authInterceptor]) // interceptor for standalone here
    // ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    DatePipe,
    AppService,
    ToastrModule,
    // AccountService,
  ],
  
}).catch((err) => console.error(err));

// bootstrapApplication(AppComponent, appConfig, )
//   .catch((err) => console.error(err));
