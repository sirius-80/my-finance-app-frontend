import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule } from '@angular/material';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { FormsModule } from '@angular/forms';
import { CategoryTransactionsComponent } from './category-transactions/category-transactions.component';


@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionsTableComponent,
    CategoryTransactionsComponent,
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
  ],
})
export class TransactionsModule {}
