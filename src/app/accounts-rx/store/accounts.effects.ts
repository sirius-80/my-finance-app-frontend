import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap, withLatestFrom, groupBy, toArray, reduce, mergeAll, filter, tap } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.reducers';
import * as accountsActions from './accounts.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Combined, Balance } from '../accounts.model';
import { Category } from 'src/app/domain/category/category';
import { of, from, zip, Observable } from 'rxjs';
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

  convertCategoryDataToDisplayElement(cd: CategoryData) {
    const element: any = {name: cd.category.name, value: cd.amount};
    if (cd.children.length > 0) {
      element.children = [];
      for (const child of cd.children) {
        element.children.push(this.convertCategoryDataToDisplayElement(child));
      }
    }
    return element;
  }

  // TODO: Fix selection of None category (display root categories), and CLEAN-UP!
  @Effect()
  categoryDataFetch = this.actions$.pipe(
    ofType(accountsActions.LOAD_CATEGORY_DATA),
    
    // Get category hiearchy (selected category and all sub-categories)
    withLatestFrom(this.store.select(state => state.domain.categories)),
    switchMap(([action, categories]: [accountsActions.LoadCategoryData, Category[]]) => {
      return from(categories).pipe(
        filter(cat => cat === action.payload || cat.inheritsFrom(action.payload)),
        toArray(),
      )
    }),
    
    withLatestFrom(this.store.select(state => state.domain.accounts)),
    switchMap(([categories, accounts]: [Category[], Account[]]) => {
      return from(accounts).pipe(
        mergeMap((account: Account) => account.transactions),
        filter((transaction: Transaction) => categories.indexOf(transaction.category) >= 0),
        groupBy((transaction: Transaction) => transaction.category),
        map(group => {
          return zip(of(group.key), group.pipe(
            reduce((acc: number, val: Transaction) => acc + val.amount, 0),
          ))
        }),
        mergeMap((val: Observable<[Category, number]>) => val), // Unpack sub-arrays
        map(value => {
          return {category: value[0], amount: value[1], children: []};
        }),
        toArray(),
        map((data: CategoryData[]) => {
          // Create initial CategoryData[]
          const organized: CategoryData[] = data;
          for (const cat of categories) {
            var found = false;
            for (const d of data) {
              if (d.category === cat) {
                found = true;
                break;
              }
            }
            if (!found) {
              organized.push({category: cat, amount: 0, children: []});
            }
          }

          // Recursively add all amounts of children to amounts of their parents
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
          const root = [];
          for (const d of data) {
            addToParents(d.category, d.amount);
            if (d.category.parent != null && d.category.parent.parent === null) {
              // Remember the root category
              root.push(d);
            }
          }


          for (const child of organized) {
            for (const parent of organized) {
              if (child.category.parent != null && child.category.parent === parent.category) {
                parent.children.push(child);
              }
            }
          }
          return root;
        }),
      );
    }),
    map((data: CategoryData[]) => {
      const pieChartData = [];
      for (const d of data) {
        pieChartData.push(this.convertCategoryDataToDisplayElement(d));
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
