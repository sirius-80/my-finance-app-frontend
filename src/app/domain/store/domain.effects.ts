import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, filter, withLatestFrom } from 'rxjs/operators';

import * as domainActions from './domain.actions';
import { Account, Transaction } from '../account/account';
import { Category } from '../category/category';
import { State } from './domain.reducers';

@Injectable()
export class DomainEffects {
  private HOST = 'localhost';

  @Effect()
  doLoadAccounts = this.actions$.pipe(
    ofType(domainActions.LOAD_ACCOUNTS),
    switchMap((action: domainActions.LoadAccounts) => {
      const url = 'http://' + this.HOST + ':5002/accounts';
      return this.httpClient.get<Account[]>(url);
    }),
    map((accounts: Account[]) => {
      return new domainActions.SetAccounts(accounts);
    })
  );

  @Effect()
  doLoadCategories = this.actions$.pipe(
    ofType(domainActions.LOAD_CATEGORIES),
    switchMap((action: domainActions.LoadCategories) => {
      const url = 'http://' + this.HOST + ':5002/categories1';
      return this.httpClient.get<Category[]>(url);
    }),
    map((categories: Category[]) => {
      return new domainActions.SetCategories(categories);
    }),
  );

  @Effect()
  doUpdateTransactionCategory = this.actions$.pipe(
    ofType(domainActions.UPDATE_TRANSACTION_CATEGORY),
    switchMap((action: domainActions.UpdateTransactionCategory) => {
      const url = 'http://' + this.HOST + ':5002/transactions/' + action.payload.transactionId + '/set_category';
      return this.httpClient.put<Transaction>(url, {categoryId: action.payload.categoryId});
    }),
    map((transaction: Transaction) => {
      return new domainActions.UpdateStateTransactionCategory(transaction);
    })
  );


  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<State>) {}
}

