import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AccountsComponent } from './accounts/accounts.component';
import { HistoryChartsComponent } from './accounts/history-charts/history-charts.component';
import { CategoryPieChartComponent } from './accounts/category-pie-chart/category-pie-chart.component';
import { AccountsRxComponent } from './accounts-rx/accounts-rx.component';
import { StoreModule } from '@ngrx/store';
import * as appReducers from './store/app.reducers';
import { environment } from 'src/environments/environment';
import { AccountsEffects } from './accounts-rx/store/accounts.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    HomeComponent,
    HistoryChartsComponent,
    CategoryPieChartComponent,
    AccountsRxComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducers.reducers),
    EffectsModule.forRoot([AccountsEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
