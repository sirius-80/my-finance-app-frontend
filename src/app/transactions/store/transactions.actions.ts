import { Action } from '@ngrx/store';
import { Category } from 'src/app/domain/category/category';
import { Transaction } from 'src/app/domain/account/account';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';
export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const UPDATE_TRANSACTION_CATEGORY = 'UPDATE_TRANSACTION_CATEGORY';
export const UPDATE_STATE_TRANSACTION_CATEGORY = 'UPDATE_STATE_TRANSACTION_CATEGORY';
export const SELECT_PERIOD = 'SELECT_PERIOD';

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

export class SelectCategory implements Action {
  readonly type = SELECT_CATEGORY;
  constructor(public payload: string) {}
}

export class UpdateTransactionCategory implements Action {
  readonly type = UPDATE_TRANSACTION_CATEGORY;
  constructor(public payload: {transactionId: string, categoryId: string}) {}
}

export class UpdateStateTransactionCategory implements Action {
  readonly type = UPDATE_STATE_TRANSACTION_CATEGORY;
  constructor(public payload: Transaction) {}
}

export class SelectPeriod implements Action {
  readonly type = SELECT_PERIOD;
  constructor(public payload: {start: Date, end: Date}) {}
}

export type transactionsActions = LoadTransactions | SetTransactions
 | UpdateTransactionCategory | UpdateStateTransactionCategory
 | LoadCategories | SetCategories | SelectCategory
 | SelectPeriod
 ;
