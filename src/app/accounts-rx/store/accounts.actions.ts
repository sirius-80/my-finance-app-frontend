import { Action } from '@ngrx/store';
import { Category } from 'src/app/accounts/accounts.model';

export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';


export class LoadCategories implements Action {
  readonly type = LOAD_CATEGORIES;
}

export class SetTransactions implements Action {
  readonly type = SET_TRANSACTIONS;

  // TODO: Add constructor (determine payload first!)
}

export class SetCategories implements Action {
  readonly type = SET_CATEGORIES;

  constructor(public payload: Category[]) {}
}

export class SelectCategory implements Action {
  readonly type = SELECT_CATEGORY;

  constructor(public payload: Category) {}
}

export type accountsActions = SetCategories | SelectCategory | SetTransactions;
