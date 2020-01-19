import { Action } from '@ngrx/store';
import { Transaction } from './transactions.reducers';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';


export class LoadTransactions implements Action {
  readonly type = LOAD_TRANSACTIONS;
  constructor(public payload: {start: Date, end: Date}) {}
}

export class SetTransactions implements Action {
  readonly type = SET_TRANSACTIONS;
  constructor(public payload: Transaction[]) {}
}


export type transactionsActions = LoadTransactions | SetTransactions;
