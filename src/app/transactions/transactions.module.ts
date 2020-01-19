import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { EffectsFeatureModule, EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';


@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionsTableComponent,
  ],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
  ],
})
export class TransactionsModule {}
