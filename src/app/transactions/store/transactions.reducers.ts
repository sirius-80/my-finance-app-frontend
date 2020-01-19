import * as TransactionsActions from './transactions.actions';

export interface Transaction {
  date: Date;
  account: string;
  amount: number;
  name: string;
  category: string;
  description: string;
  counter_account: string;
  internal: boolean;
}

export interface State {
  transactions: Transaction[];
}

const initialState: State = {
  transactions: [],
};


export function transactionsReducer(state = initialState, action: TransactionsActions.transactionsActions) {
  console.log('Reducing action', action);

  switch (action.type) {
    case TransactionsActions.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };
    default:
      return state;
  }
}
