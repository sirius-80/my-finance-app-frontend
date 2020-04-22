import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap, withLatestFrom, concatMap, groupBy, toArray, reduce, mergeAll, concatAll, filter, tap, buffer } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.reducers';
import * as accountsActions from './accounts.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Combined, Balance } from '../accounts.model';
import { Category } from 'src/app/domain/category/category';
import { of, from, zip } from 'rxjs';
import { Account, Transaction } from 'src/app/domain/account/account';
import { CategoryData } from './accounts.reducers';


@Injectable()
export class AccountsEffects {
  private HOST = 'localhost';

  @Effect()
  selectCategoryById = this.actions$.pipe(
    ofType(accountsActions.SELECT_CATEGORY_BY_ID),
    withLatestFrom(this.store.select(state => state.domain.categories)),
    map(([action, categories]: [accountsActions.SelectCategoryById, Category[]]) => {
      console.log('Selecting category via effect');
      return new accountsActions.SelectCategory(categories.find((category) => category.id === action.payload));
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

  // @Effect()
  // categoryDataFetch = this.actions$.pipe(
  //   ofType(accountsActions.LOAD_CATEGORY_DATA),
  //   withLatestFrom(this.store.select(state => state.accounts.period)),
  //   switchMap(([action, period]: [accountsActions.LoadCategoryData, {start: Date, end: Date}]) => {
  //     const params = new HttpParams().append('start', '' + period.start.getTime()).append('end', '' + period.end.getTime());
  //     let url = 'http://' + this.HOST + ':5002/combined_categories/';
  //     if (action.payload) {
  //       url += action.payload.id;
  //     } else {
  //       url += '0';
  //     }
  //     return this.httpClient.get<CategoryData[]>(url, {params});
  //   }),
  //   map((data: CategoryData[]) => {
  //     return new accountsActions.SetCategoryData(data);
  //   })
  // );


  // TODO: Fix selection of None category (display root categories), and CLEAN-UP!
  @Effect()
  categoryDataFetch2 = this.actions$.pipe(
    ofType(accountsActions.LOAD_CATEGORY_DATA),
    withLatestFrom(this.store.select(state => state.domain.categories)),
    switchMap(([action, categories]: [accountsActions.LoadCategoryData, Category[]]) => {
      return from(categories).pipe(
        filter(cat => cat.id === action.payload.id || cat.inheritsFrom(action.payload)),
        toArray(),
      )
    }),
    withLatestFrom(this.store.select(state => state.domain.accounts)),
    // tap(([categories, accounts]) => console.log('TAP0:', categories, accounts)),
    switchMap(([categories, accounts]: [Category[], Account[]]) => {
      // console.log('TAP1:', categories, accounts);
      return from(accounts).pipe(
        map((account: Account) => account.transactions),
        // tap(val => console.log('TAP2 (mapped):', val)),
        mergeAll(),
        // tap(val => console.log('TAP3 (mergeAll):', val)), // TOO MANY VALUES!
        filter((transaction: Transaction) => categories.indexOf(transaction.category) >= 0),
        // tap(val => console.log('TAP4 (filtered):', val)), // TOO MANY VALUES!
        groupBy((transaction: Transaction) => transaction.category),
        // tap(group => console.log('TAP5 (grouped):', group)),
        map(group => {
          return zip(of(group.key), group.pipe(
            toArray(),
            // tap(val => console.log('TAP6 (toArray):', val)),
            mergeMap(transaction => transaction),
            map(transaction => transaction.amount),
            reduce((acc, val) => acc + val),
            // tap(val => console.log('TAP7 (reduced):', val)),
          ))
        }),
        mergeMap(val => val), // Unpack sub-arrays
        // tap(val => console.log('TAP8 (mergeMapped):', val)),
        map(value => {
          return {category: value[0], amount: value[1], children: []};
        }),
        // tap(val => console.log('TAP9 (final):', val.category.getQualifiedName(), val.amount)), // Never happens...
        toArray(),
        // tap(val => console.log('TAP10 (unstructured)', val)),
        map((data: CategoryData[]) => {
          const organized: CategoryData[] = [];
          for (const cat of categories) {
            var found = false;
            for (const d of data) {
              if (d.category === cat) {
                organized.push(d);
                found = true;
                break;
              }
            }
            if (!found) {
              organized.push({category: cat, amount: 0, children: []});
            }
          }
          for (const d of data) {
            function addToParents(category: Category, amount: number) {
              if (category.parent) {
                for (const parent of organized) {
                  if (parent.category === category.parent) {
                    parent.amount += amount;
                    addToParents(parent.category, amount)
                  }
                }
              }
            }
            addToParents(d.category, d.amount);
          }
          for (const child of organized) {
            // console.log('Processing child', child.category);
            
            for (const parent of organized) {
              if (child.category.parent != null && parent.category != null && child.category.parent.id === parent.category.id) {
                // console.log('Adding child', child, 'to parent', parent);
                parent.children.push(child);
              }
            }
          }
          const sparse = [];
          for (const d of organized) {
            if (d.category.parent != null && d.category.parent.parent === null) {
              sparse.push(d);
            }
          }
          return sparse;
        }),
      );
    }),
    // tap(val => console.log('TAP11 (structured)', val)),
    map((data: CategoryData[]) => {
      function convertToDisplayElement(cd: CategoryData) {
        const element: any = {name: cd.category.name, value: cd.amount};
        if (cd.children.length > 0) {
          element.children = [];
          for (const child of cd.children) {
            element.children.push(convertToDisplayElement(child));
          }
        }
        return element;
      }
      const pieChartData = [];
      for (const d of data) {
        if (d.category.parent != null && d.category.parent.parent === null) {
          pieChartData.push(convertToDisplayElement(d));
        }
      }
      return new accountsActions.SetCategoryData(pieChartData);
    }),
  );

  // @Effect()
  // loadCombinedData = this.actions$.pipe(
  //   ofType(accountsActions.LOAD_MONTHLY_COMBINED_DATA),
  //   withLatestFrom(this.store.select(state => state.domain.accounts)),
  //   map(([action, accounts]) => accounts),
  //   concatMap(of),
  //   mergeMap((account: Account) => account.transactions),
  //   withLatestFrom(this.store.select(state => state.accounts.selectedCategory)),
  //   map(([transaction, category]: [Transaction, Category]) => {
  //     return {
  //       date: transaction.date,
  //       balance: transaction.balanceAfter,
  //       income: transaction.amount > 0 && transaction.amount || 0,
  //       expenses: transaction.amount < 0 && transaction.amount || 0,
  //       profit: 0,
  //       loss: 0,
  //     };
  //   })
  //  TODO: combine into monhtly chunks!
  // )

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

  constructor(private actions$: Actions,
              private httpClient: HttpClient,
              private store: Store<AppState>) {}
}
