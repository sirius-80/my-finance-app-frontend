import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TransactionsComponent } from './transactions.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';


const transactionsRoutes: Routes = [
  { path: 'transactions', component: TransactionsComponent, children: [
    { path: 'transactions', component: TransactionsTableComponent }
  ] },
];

@NgModule({
  imports: [
    RouterModule.forChild(transactionsRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class TransactionsRoutingModule {}
