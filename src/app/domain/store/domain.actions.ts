import { Action } from '@ngrx/store';
import { Account, Transaction } from '../account/account';
import { Category } from '../category/category';

export const LOAD_ACCOUNTS = 'DOMAIN_LOAD_ACCOUNTS';
export const SET_ACCOUNTS = 'DOMAIN_SET_ACCOUNTS';
export const RESOLVE_TRANSACTION_CATEGORY = 'DOMAIN_RESOLVE_TRANSACTION_CATEGORY';
export const LOAD_CATEGORIES = 'DOMAIN_LOAD_CATEGORIES';
export const SET_CATEGORIES = 'DOMAIN_SET_CATEGORIES';
export const UPDATE_TRANSACTION_CATEGORY = 'DOMAIN_UPDATE_TRANSACTION_CATEGORY';
export const UPDATE_STATE_TRANSACTION_CATEGORY = 'DOMAIN_UPDATE_STATE_TRANSACTION_CATEGORY';

export class LoadAccounts implements Action {
  readonly type = LOAD_ACCOUNTS;
}

export class SetAccounts implements Action {
  readonly type = SET_ACCOUNTS;
  constructor(public payload: Account[]) {}
}

export class LoadCategories implements Action {
  readonly type = LOAD_CATEGORIES;
}

export class SetCategories implements Action {
  readonly type = SET_CATEGORIES;
  constructor(public payload: Category[]) {}
}

export class ResolveTransactionCategory implements Action {
  readonly type = RESOLVE_TRANSACTION_CATEGORY;
  constructor(public payload: Transaction) {}
}

export class UpdateTransactionCategory implements Action {
  readonly type = UPDATE_TRANSACTION_CATEGORY;
  constructor(public payload: {transactionId: string, categoryId: string}) {}
}

export class UpdateStateTransactionCategory implements Action {
  readonly type = UPDATE_STATE_TRANSACTION_CATEGORY;
  constructor(public payload: Transaction) {}
}

export type domainActions = LoadAccounts | SetAccounts | ResolveTransactionCategory
 | UpdateTransactionCategory | UpdateStateTransactionCategory
 | LoadCategories | SetCategories
 ;
