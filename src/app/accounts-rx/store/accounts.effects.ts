import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.reducers';
import * as accountsActions from './accounts.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category, Combined, Balance } from '../accounts.model';
import { CategoryData } from './accounts.reducers';


@Injectable()
export class AccountsEffects {
  private HOST = 'localhost';
  @Effect()
  categoriesFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_CATEGORIES),
    switchMap((action: accountsActions.LoadCategories) => {
      console.log('handling', action);
      const url = 'http://' + this.HOST + ':5002/categories';
      return this.httpClient.get<Category[]>(url);
    }),
    map((categories: Category[]) => {
      return new accountsActions.SetCategories(categories);
    })
  );

  @Effect()
  categoryDataTrigger = this.actions$.pipe(
    ofType(accountsActions.LOAD_ALL_CATEGORY_DATA),
    mergeMap((action: accountsActions.LoadAllCategoryData) => {
      return [
        new accountsActions.LoadCategoryData(action.payload),
        new accountsActions.LoadMonthlyCategoryData(action.payload),
        new accountsActions.LoadYearlyCategoryData(action.payload)
      ];
    })
  );

  @Effect()
  combinedDataTrigger = this.actions$.pipe(
    ofType(accountsActions.LOAD_COMBINED_DATA),
    mergeMap((action: accountsActions.LoadCombinedData) => {
      return [
        new accountsActions.LoadMonthlyCombinedData(),
        new accountsActions.LoadYearlyCombinedData(),
      ];
    })
  );

  @Effect()
  monthlyCategoryDataFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_MONTHLY_CATEGORY_DATA),
    switchMap((action: accountsActions.LoadMonthlyCategoryData) => {
      let url = 'http://' + this.HOST + ':5002/categories/';
      if (action.payload) {
        url += action.payload.id;
      } else {
        url += '0';
      }
      const params = new HttpParams().set('mode', 'monthly');
      return this.httpClient.get<Balance[]>(url, {params} );
    }),
    map((data: Balance[]) => {
      return new accountsActions.SetMonthlyCategoryData(data);
    })
  );

  @Effect()
  yearlyCategoryDataFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_YEARLY_CATEGORY_DATA),
    switchMap((action: accountsActions.LoadYearlyCategoryData) => {
      let url = 'http://' + this.HOST + ':5002/categories/';
      if (action.payload) {
        url += action.payload.id;
      } else {
        url += '0';
      }
      const params = new HttpParams().set('mode', 'yearly');
      return this.httpClient.get<Balance[]>(url, {params} );
    }),
    map((data: Balance[]) => {
      return new accountsActions.SetYearlyCategoryData(data);
    })
  );

  @Effect()
  categoryDataFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_CATEGORY_DATA),
    withLatestFrom(this.store.select(state => state.accounts.period)),
    switchMap(([action, period]: [accountsActions.LoadCategoryData, {start: Date, end: Date}]) => {
      const params = new HttpParams().append('start', '' + period.start.getTime()).append('end', '' + period.end.getTime());
      let url = 'http://' + this.HOST + ':5002/combined_categories/';
      if (action.payload) {
        url += action.payload.id;
      } else {
        url += '0';
      }
      return this.httpClient.get<CategoryData[]>(url, {params});
    }),
    map((data: CategoryData[]) => {
      return new accountsActions.SetCategoryData(data);
    })
  );

  @Effect()
  monthlyCombinedDataFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_MONTHLY_COMBINED_DATA),
    switchMap((action: accountsActions.LoadMonthlyCombinedData) => {
      const url = 'http://' + this.HOST + ':5002/combined';
      const params = new HttpParams().set('mode', 'monthly');
      return this.httpClient.get<Combined[]>(url, {params} );
    }),
    mergeMap((combined: Combined[]) => {
      const actions = [];
      actions.push(new accountsActions.SetMonthlyCombinedData(combined));
      if (combined.length > 0) {
        const start = new Date(combined[0].date);
        const end = new Date(combined[combined.length - 1].date);
        actions.push(new accountsActions.SetPeriod({start, end}));
      }
      return actions;
    })
  );

  @Effect()
  yearlyCombinedDataFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_YEARLY_COMBINED_DATA),
    switchMap((action: accountsActions.LoadYearlyCombinedData) => {
      const url = 'http://' + this.HOST + ':5002/combined';
      const params = new HttpParams().set('mode', 'yearly');
      return this.httpClient.get<Combined[]>(url, {params} );
    }),
    mergeMap((combined: Combined[]) => {
      const actions = [];
      actions.push(new accountsActions.SetYearlyCombinedData(combined));
      if (combined.length > 0) {
        const start = new Date(combined[0].date);
        const end = new Date(combined[combined.length - 1].date);
        actions.push(new accountsActions.SetPeriod({start, end}));
      }
      return actions;
    })
  );

  // @Effect()
  // combinedDataFetch = this.actions$.pipe(
  //   ofType(accountsActions.LOAD_COMBINED_DATA),
  //   switchMap((action: accountsActions.LoadCombinedData) => {
  //     const url = 'http://' + this.HOST + ':5002/combined';
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
