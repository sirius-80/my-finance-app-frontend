import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';

import * as TransactionActions from './transactions.actions';
import { Transaction } from './transactions.reducers';
import { AppState } from 'src/app/store/app.reducers';


@Injectable()
export class TransactionsEffects {
  @Effect()
  transactionsFetch = this.actions$.pipe(
    ofType(TransactionActions.LOAD_TRANSACTIONS),
    switchMap((action: TransactionActions.LoadTransactions) => {
      console.log('handling', action);
      const url = 'http://localhost:5002/transactions';
      const params = new HttpParams().set('start', '' + action.payload.start.getTime()).append('end', '' + action.payload.end.getTime());
      return this.httpClient.get<Transaction[]>(url, {params});
    }),
    map((transactions: Transaction[]) => {
      return new TransactionActions.SetTransactions(transactions);
    })
  );


  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<AppState>) {}
}

