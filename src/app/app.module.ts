import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import * as appReducers from './store/app.reducers';
import { environment } from 'src/environments/environment';
import { AccountsEffects } from './accounts-rx/store/accounts.effects';
import { TransactionsEffects } from './transactions/store/transactions.effects';
import { AccountsRxModule } from './accounts-rx/accounts-rx.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadModule } from './upload/upload.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AccountsRxModule,
    TransactionsModule,
    UploadModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducers.reducers),
    EffectsModule.forRoot([AccountsEffects, TransactionsEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
