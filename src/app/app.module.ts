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
import { AccountsComponent } from './accounts/accounts.component';
import { HistoryChartsComponent } from './accounts/history-charts/history-charts.component';
import { HistoryChartsRxComponent } from './accounts-rx/history-charts-rx/history-charts-rx.component';
import { CategoryPieChartComponent } from './accounts/category-pie-chart/category-pie-chart.component';
import { AccountsRxComponent } from './accounts-rx/accounts-rx.component';
import * as appReducers from './store/app.reducers';
import { environment } from 'src/environments/environment';
import { AccountsEffects } from './accounts-rx/store/accounts.effects';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    HomeComponent,
    HistoryChartsComponent,
    HistoryChartsRxComponent,
    CategoryPieChartComponent,
    AccountsRxComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
