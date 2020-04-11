import { ActionReducerMap } from '@ngrx/store';

import * as fromAccounts from '../accounts-rx/store/accounts.reducers';
import * as fromTransactions from '../transactions/store/transactions.reducers';
import * as fromDomain from '../domain/store/domain.reducers';

export interface AppState {
  accounts: fromAccounts.State;
  transactions: fromTransactions.State;
  domain: fromDomain.State;
}

export const reducers: ActionReducerMap<AppState> = {
  accounts: fromAccounts.accountsReducer,
  transactions: fromTransactions.transactionsReducer,
  domain: fromDomain.domainReducer,
};
