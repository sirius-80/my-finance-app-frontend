import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRxRoutingModule } from './accounts-rx-routing.module';
import { AccountsRxComponent } from './accounts-rx.component';
import { HistoryChartsRxComponent } from './history-charts-rx/history-charts-rx.component';
import { CategoryBarChartComponent } from './category/category-bar-chart/category-bar-chart.component';
import {CategoryHierarchyChartComponent } from './category/category-hierarchy-chart/category-hierarchy-chart.component';
import { CategoryComponent } from './category/category.component';
import { MatButtonModule, MatSelectModule, MatRadioModule } from '@angular/material';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccountsRxComponent,
    HistoryChartsRxComponent,
    CategoryBarChartComponent,
    CategoryHierarchyChartComponent,
    CategoryComponent,
  ],
  imports: [
    CommonModule,
    AccountsRxRoutingModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatRadioModule,
  ],
})
export class AccountsRxModule {}
