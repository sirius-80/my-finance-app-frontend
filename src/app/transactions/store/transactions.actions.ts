import { Action } from '@ngrx/store';
import { Transaction } from './transactions.reducers';
import { Category } from 'src/app/accounts-rx/accounts.model';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';
export const SET_CATEGORIES = 'SET_CATEGORIES';

export class LoadTransactions implements Action {
  readonly type = LOAD_TRANSACTIONS;
  constructor(public payload: {start: Date, end: Date}) {}
}

export class SetTransactions implements Action {
  readonly type = SET_TRANSACTIONS;
  constructor(public payload: Transaction[]) {}
}

export class LoadCategories implements Action {
  readonly type = LOAD_CATEGORIES;
}

export class SetCategories implements Action {
  readonly type = SET_CATEGORIES;
  constructor(public payload: Category[]) {}
}


export type transactionsActions = LoadTransactions | SetTransactions
 | LoadCategories | SetCategories
 ;
