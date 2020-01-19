import { ActionReducerMap } from '@ngrx/store';

import * as fromAccounts from '../accounts-rx/store/accounts.reducers';
import * as fromTransactions from '../transactions/store/transactions.reducers';

export interface AppState {
  accounts: fromAccounts.State;
  transactions: fromTransactions.State;
}

export const reducers: ActionReducerMap<AppState> = {
  accounts: fromAccounts.accountsReducer,
  transactions: fromTransactions.transactionsReducer
};
