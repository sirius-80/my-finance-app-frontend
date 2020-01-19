import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRxRoutingModule } from './accounts-rx-routing.module';
import { AccountsRxComponent } from './accounts-rx.component';
import { HistoryChartsRxComponent } from './history-charts-rx/history-charts-rx.component';
import { CategoryBarChartComponent } from './category-bar-chart/category-bar-chart.component';
import {CategoryHierarchyChartComponent } from './category-hierarchy-chart/category-hierarchy-chart.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';


@NgModule({
  declarations: [
    AccountsRxComponent,
    HistoryChartsRxComponent,
    CategoryBarChartComponent,
    CategoryHierarchyChartComponent,
    TransactionsTableComponent
  ],
  imports: [
    CommonModule,
    AccountsRxRoutingModule,
  ],
})
export class AccountsRxModule {}
