import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';

import * as TransactionActions from './transactions.actions';
import { AppState } from 'src/app/store/app.reducers';
import { Transaction, Account } from 'src/app/domain/account/account';


@Injectable()
export class TransactionsEffects {
  private HOST = 'localhost';

  @Effect()
  transactionsFetch = this.actions$.pipe(
    ofType(TransactionActions.LOAD_TRANSACTIONS),
    withLatestFrom(this.store.select(state => state.domain.accounts)),
    map(([action, accounts]: [TransactionActions.LoadTransactions, Account[]]) => {
      const transactions: Transaction[] = [];
      const start = action.payload.start.getTime();
      const end = action.payload.end.getTime();
      for (const account of accounts) {
        for (const transaction of account.transactions) {
          if (start <= transaction.date.getTime() && transaction.date.getTime() <= end) {
            transactions.push(transaction);
          }
        }
      }
      console.log('Selected ', transactions.length, 'transactions between', start, 'and', end);
      return new TransactionActions.SetTransactions(transactions);
    }),
  );

  @Effect()
  transactionCategoryUpdate = this.actions$.pipe(
    ofType(TransactionActions.UPDATE_TRANSACTION_CATEGORY),
    switchMap((action: TransactionActions.UpdateTransactionCategory) => {
      const url = 'http://' + this.HOST + ':5002/transactions/' + action.payload.transactionId + '/set_category';
      return this.httpClient.put<Transaction>(url, {categoryId: action.payload.categoryId});
    }),
    map((transaction: Transaction) => {
      return new TransactionActions.UpdateStateTransactionCategory(transaction);
    })
  );


  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<AppState>) {}
}

