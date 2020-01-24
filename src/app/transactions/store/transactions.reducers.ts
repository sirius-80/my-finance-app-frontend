import * as TransactionsActions from './transactions.actions';
import { Category } from 'src/app/accounts-rx/accounts.model';

export interface Transaction {
  id: string;
  date: Date;
  account: string;
  amount: number;
  name: string;
  category: Category;
  description: string;
  counter_account: string;
  internal: boolean;
}

export interface State {
  transactions: Transaction[];
  categories: Category[];
}

const initialState: State = {
  transactions: [],
  categories: [],
};


export function transactionsReducer(state = initialState, action: TransactionsActions.transactionsActions) {
  console.log('Reducing action', action);

  switch (action.type) {
    case TransactionsActions.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };
    case TransactionsActions.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
}
