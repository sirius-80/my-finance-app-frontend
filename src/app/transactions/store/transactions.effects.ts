import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';

import * as TransactionActions from './transactions.actions';
import { Transaction } from './transactions.reducers';
import { AppState } from 'src/app/store/app.reducers';
import { Category } from 'src/app/accounts-rx/accounts.model';


@Injectable()
export class TransactionsEffects {
  @Effect()
  transactionsFetch = this.actions$.pipe(
    ofType(TransactionActions.LOAD_TRANSACTIONS),
    switchMap((action: TransactionActions.LoadTransactions) => {
      const url = 'http://localhost:5002/transactions';
      const params = new HttpParams().set('start', '' + action.payload.start.getTime()).append('end', '' + action.payload.end.getTime());
      return this.httpClient.get<Transaction[]>(url, {params});
    }),
    map((transactions: Transaction[]) => {
      return new TransactionActions.SetTransactions(transactions);
    })
  );

  @Effect()
  categoriesFetch = this.actions$.pipe(
    ofType(TransactionActions.LOAD_CATEGORIES),
    switchMap((action: TransactionActions.LoadCategories) => {
      const url = 'http://localhost:5002/categories';
      return this.httpClient.get<Category[]>(url);
    }),
    map((categories: Category[]) => {
      return new TransactionActions.SetCategories(categories);
    })
  );

  @Effect()
  transactionCategoryUpdate = this.actions$.pipe(
    ofType(TransactionActions.UPDATE_TRANSACTION_CATEGORY),
    switchMap((action: TransactionActions.UpdateTransactionCategory) => {
      const url = 'http://localhost:5002/transactions/' + action.payload.transactionId + '/set_category';
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

