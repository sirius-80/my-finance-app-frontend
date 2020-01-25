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
    case TransactionsActions.UPDATE_STATE_TRANSACTION_CATEGORY:
      let index = -1;
      for (let i = 0; i < state.transactions.length; i++) {
        if (state.transactions[i].id === action.payload.id) {
          index = i;
          break;
        }
      }
      let updatedTransactions = [...state.transactions];
      updatedTransactions[index] = action.payload;
      return {
        ...state,
        transactions: updatedTransactions,
      }
    default:
      return state;
  }
}
