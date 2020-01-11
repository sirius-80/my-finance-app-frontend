import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CategoryChartComponent } from './accounts/category-chart/category-chart.component';
import { HistoryChartsComponent } from './accounts/history-charts/history-charts.component';
import { CategoryPieChartComponent } from './accounts/category-pie-chart/category-pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    HomeComponent,
    CategoryChartComponent,
    HistoryChartsComponent,
    CategoryPieChartComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
