import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.reducers';
import * as accountsActions from './accounts.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category, Combined } from '../accounts.model';


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

  @Effect()
  monthlyCombinedDataFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_MONTHLY_COMBINED_DATA),
    switchMap((action: accountsActions.LoadMonthlyCombinedData) => {
      const url = 'http://localhost:5002/combined';
      const params = new HttpParams().set('mode', 'monthly');
      return this.httpClient.get<Combined[]>(url, {params} );
    }),
    mergeMap((combined: Combined[]) => {
      const actions = [];
      actions.push(new accountsActions.SetMonthlyCombinedData(combined));
      if (combined.length > 0) {
        const start = combined[0].date;
        const end = combined[combined.length - 1].date;
        actions.push(new accountsActions.SetPeriod({start, end}));
      }
      return actions;
    })
  );

  // @Effect()
  // combinedDataFetch = this.actions$.pipe(
  //   ofType(accountsActions.LOAD_COMBINED_DATA),
  //   switchMap((action: accountsActions.LoadCombinedData) => {
  //     const url = 'http://localhost:5002/combined';
  //     const params = new HttpParams().set('mode', action.payload);
  //     return this.httpClient.get<Combined[]>(url, {params} );
  //   }),
  //   map((combined: Combined[]) => {
  //     // TODO: FIXME: Need to call either monthly of yearly!
  //     return new accountsActions.SetMonthlyCombinedData(combined);
  //   })
  // );

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<AppState>) {}
}
