import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, mergeMap, withLatestFrom, groupBy, toArray, reduce, filter, combineLatest, last, tap, mergeAll, first, switchMapTo, defaultIfEmpty, mergeMapTo, concatMap } from 'rxjs/operators';

import { AppState } from 'src/app/store/app.reducers';
import * as accountsActions from './accounts.actions';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Combined, Balance } from '../accounts.model';
import { Category } from 'src/app/domain/category/category';
import { of, from, zip, Observable, generate, merge } from 'rxjs';
import { Account, Transaction } from 'src/app/domain/account/account';
import { CategoryData } from './accounts.reducers';
import { group } from '@angular/animations';


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
  monthlyCategoryDataFetchDomain = this.actions$.pipe(
    ofType(accountsActions.LOAD_MONTHLY_CATEGORY_DATA, accountsActions.LOAD_YEARLY_CATEGORY_DATA),
    withLatestFrom(this.store.select(state => state.domain.accounts)),
    switchMap(([action, accounts]: [accountsActions.LoadMonthlyCategoryData | accountsActions.LoadYearlyCategoryData, Account[]]) => {
      return from(accounts).pipe(
        mergeMap(account => account.transactions),
        filter(transaction => transaction.category === action.payload || (transaction.category && transaction.category.inheritsFrom(action.payload))),
        groupBy(transaction => {
          let month = transaction.date.getMonth();
          if (action instanceof accountsActions.LoadYearlyCategoryData) {
            month = 1;
          }
          console.log('ACTION:', action);
          return new Date(transaction.date.getFullYear(), month, 1).getTime();
        }),
        map(group => {
          return zip(of(group.key), group.pipe(
            reduce((acc: number, val: Transaction) => acc + val.amount, 0),
          ))
        }),
        mergeMap(val => val),
        map(val => {
          return { date: new Date(val[0]), amount: val[1] };
        }),
        toArray(),
        combineLatest(data => [action, data]),
      );
    }),
    map(([action, data]: [accountsActions.LoadMonthlyCategoryData | accountsActions.LoadYearlyCategoryData, { date: Date, amount: number }[]]) => {
      if (action instanceof accountsActions.LoadMonthlyCategoryData) {
        return new accountsActions.SetMonthlyCategoryData(data);
      } else {
        return new accountsActions.SetYearlyCategoryData(data);
      }
    }));

  convertCategoryDataToDisplayElement(cd: CategoryData) {
    const element: any = { name: cd.category.name, value: cd.amount };
    if (cd.children.length > 0) {
      element.children = [];
      for (const child of cd.children) {
        element.children.push(this.convertCategoryDataToDisplayElement(child));
      }
    }
    return element;
  }

  // TODO: Fix selection of None category (display root categories) and of level-3 categories, and CLEAN-UP!
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
          return { category: value[0], amount: value[1], children: [] };
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
              organized.push({ category: cat, amount: 0, children: [] });
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

  /**
   * Generate dates
   */
  dateGenerator(startDate: Date, endDate: Date) {
    const temp = new Date(startDate.getTime());
    const start = new Date(temp.setMonth(temp.getMonth() + 1, 1)); // Extend 1 month, set to the first of the month
    const temp2 = new Date(endDate.getTime());
    const limit = new Date(temp2.setMonth(temp2.getMonth() + 1, 1)); // Extend to next month
    return generate(
      start,
      date => date <= limit,
      date => {
        const temp = new Date(date.getTime());
        return new Date(temp.setMonth(temp.getMonth() + 1));
      }
    );
  }

  // @Effect()
  // monthlyCombinedDataFetch = this.actions$.pipe(
  //   ofType(accountsActions.LOAD_MONTHLY_COMBINED_DATA),
  //   switchMap((action: accountsActions.LoadMonthlyCombinedData) => {
  //     const url = 'http://' + this.HOST + ':5002/combined';
  //     const params = new HttpParams().set('mode', 'monthly');
  //     return this.httpClient.get<Combined[]>(url, {params} );
  //   }),
  //   mergeMap((combined: Combined[]) => {
  //     const actions = [];
  //     actions.push(new accountsActions.SetMonthlyCombinedData(combined));
  //     if (combined.length > 0) {
  //       const start = new Date(combined[0].date);
  //       const end = new Date(combined[combined.length - 1].date);
  //       actions.push(new accountsActions.SetPeriod({start, end}));
  //     }
  //     return actions;
  //   })
  // );

  // TODO: Merge balance-data into this one    
  @Effect()
  combinedDataFetchDomain2 = this.actions$.pipe(
    ofType(accountsActions.LOAD_MONTHLY_COMBINED_DATA),
    switchMapTo(this.store.select(state => state.domain.accounts)),
    switchMap((accounts: Account[]) => from(accounts).pipe(
      switchMap((account) => {
        // console.log('Collecting data from account', account.name, account.bank);

        return from(account.transactions).pipe( // determine date of first transaction of this account
          first(),
          tap(val => console.log('FIRST Transaction', val)),
          map(transaction => transaction.date),
          switchMap(startDate => this.dateGenerator(startDate, new Date())), // Generate list of monthly dates, starting at given startDate
          switchMap(date => { // Determine balance of this account at given date
            // console.log('GENERATED DATE', date);
            const thisMonthTransactions = from(account.transactions).pipe(
              filter(transaction => !transaction.internal),
              filter(transaction => {
                const tempDate = new Date(date.getTime());
                return transaction.date < new Date(tempDate.setMonth(tempDate.getMonth() + 1)) && transaction.date > date;
              })
            );

            return zip(
              of(date),
              from(account.transactions).pipe( // Find the last balance at given date 
                filter(transaction => transaction.date < date),
                defaultIfEmpty(new Transaction('', null, 0, date, 0, '', '', '', false, null, 0)), // If there are no transaction before given date, then the balance is 0 (account did not yet exist)
                map(transaction => transaction.balanceAfter), // Map the transaction to something simpeler
                last(), // We're only interested in the last
              ),
              from(account.transactions).pipe(
                filter(transaction => !transaction.internal),
                filter(transaction => {
                  const tempDate = new Date(date.getTime());
                  return transaction.date < new Date(tempDate.setMonth(tempDate.getMonth() + 1)) && transaction.date > date;
                }),
                filter(transaction => transaction.amount > 0),
                map(t => t.amount),
                reduce((acc: number, amount: number) => acc + amount, 0),
              ),
              from(account.transactions).pipe(
                filter(transaction => !transaction.internal),
                filter(transaction => {
                  const tempDate = new Date(date.getTime());
                  return transaction.date < new Date(tempDate.setMonth(tempDate.getMonth() + 1)) && transaction.date > date;
                }),
                filter(transaction => transaction.amount < 0),
                map(t => t.amount),
                reduce((acc: number, amount: number) => acc + amount, 0),
              ),
              from(account.transactions).pipe(
                filter(transaction => !transaction.internal),
                filter(transaction => {
                  const tempDate = new Date(date.getTime());
                  return transaction.date < new Date(tempDate.setMonth(tempDate.getMonth() + 1)) && transaction.date > date;
                }),
                map(t => t.amount),
                reduce((acc: number, amount: number) => acc + amount, 0),
                map(profit => profit > 0 && profit || 0)
              ),
              from(account.transactions).pipe(
                filter(transaction => !transaction.internal),
                filter(transaction => {
                  const tempDate = new Date(date.getTime());
                  return transaction.date < new Date(tempDate.setMonth(tempDate.getMonth() + 1)) && transaction.date > date;
                }),
                map(t => t.amount),
                reduce((acc: number, amount: number) => acc + amount, 0),
                map(loss => loss > 0 && loss || 0)
              ),
            );
          }),
          map(data => new Combined(data[0], data[1], data[2], data[3], data[4], data[5])),
        );
      }),

      groupBy(combined => combined.date.getTime()),
      tap(val => console.log('GROUPS', val)),
      map((group) => group.pipe(
        reduce((acc, val) => acc.add(val), new Combined(new Date(group.key), 0, 0, 0, 0, 0)),
      )),
      mergeAll(),
      toArray(),
    ),
    ),
    tap(val => console.log('COMBINED: ', val)),
    map((data) => new accountsActions.SetMonthlyCombinedData(data))
  );

  constructor(private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<AppState>) { }
}
