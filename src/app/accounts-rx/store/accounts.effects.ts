import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.reducers';
import * as accountsActions from './accounts.actions';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/accounts/accounts.model';


@Injectable()
export class AccountsEffects {
  @Effect()
  categoriesFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_CATEGORIES),
    switchMap((action: accountsActions.LoadCategories) => {
      console.log('handling', action);
      const url = 'http://localhost:5002/categories';
      return this.httpClient.get<Category[]>(url);
    }),
    map((categories: Category[]) => {
      console.log('Dispatching SET_CATEGORIES', categories);
      return new accountsActions.SetCategories(categories);
    })
  );

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<AppState>) {}
}
