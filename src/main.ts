// import { bootstrapApplication } from '@angular/platform-browser';
// import { App } from './app/app';
// import { appConfig } from './app/app.config';
// import { HttpClientModule } from '@angular/common/http';
// import { importProvidersFrom } from '@angular/core';


// bootstrapApplication(App, {
//   ...appConfig,
//   providers: [
//     ...appConfig.providers,
//     importProvidersFrom(HttpClientModule)
//   ]
// });


// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './app/ApiService/token-interceptor';
import { appConfig } from './app/app.config';

import { App } from './app/app';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ]
});
