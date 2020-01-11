import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BalanceChartComponent } from './accounts/balance-chart/balance-chart.component';
import { IncomeExpensesChartComponent } from './accounts/income-expenses-chart/income-expenses-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CategoryChartComponent } from './accounts/category-chart/category-chart.component';
import { HistoryChartsComponent } from './accounts/history-charts/history-charts.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    BalanceChartComponent,
    HomeComponent,
    IncomeExpensesChartComponent,
    CategoryChartComponent,
    HistoryChartsComponent,
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
