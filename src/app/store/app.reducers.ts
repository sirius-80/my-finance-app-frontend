import { ActionReducerMap } from '@ngrx/store';

import * as fromAccounts from '../accounts-rx/store/accounts.reducers';

export interface AppState {
  accounts: fromAccounts.State;
}

export const reducers: ActionReducerMap<AppState> = {
  accounts: fromAccounts.accountsReducer
};
