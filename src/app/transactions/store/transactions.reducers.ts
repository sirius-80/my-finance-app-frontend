import * as TransactionsActions from './transactions.actions';
import { act } from '@ngrx/effects';
import { Category } from 'src/app/domain/category/category';
import { Transaction } from 'src/app/domain/account/account';


export function categoryInheritsFrom(child: Category, other: Category) {
  if (other && child.id === other.id) {
    return true;
  } else if (child.parent) {
    return categoryInheritsFrom(child.parent, other);
  } else {
    return false;
  }
}


export interface State {
  transactions: Transaction[];
  categories: Category[];
  selectedTransactions: Transaction[];
  barChartData: { date: Date, amount: number }[];
  selectedPeriod: { start: Date, end: Date };
  selectedCategory: Category;
}

const initialState: State = {
  transactions: [],
  categories: [],
  selectedTransactions: [],
  barChartData: [],
  selectedPeriod: { start: new Date(1970, 1), end: new Date() },
  selectedCategory: null,
};

function determineSelectedTransactions(state: State, category: Category, period: { start: Date, end: Date }) {
  let selected = category;
  const selectedTransactions = [];
  if (selected) {
    for (const t of state.transactions) {
      if ((t.category && categoryInheritsFrom(t.category, selected))
        || (!t.category && selected.id.toString() === '0')) {
        t.date = new Date(t.date);
        if (t.date >= period.start && t.date <= period.end) {
          selectedTransactions.push(t);
        }
      }
    }
    selectedTransactions.sort((a: Transaction, b: Transaction) => {
      return a.date.getTime() - b.date.getTime();
    });
  }
  console.log('Determined transactions: ', selectedTransactions.length);
  return {
    ...state,
    selectedTransactions,
    selectedCategory: selected,
    selectedPeriod: period,
  };
}

function getBarchartData(selectedTransactions: Transaction[]) {
  const barChartData = [];
  let month = null;
  let sum = 0;
  for (const t of selectedTransactions) {
    if (month !== null && t.date.getFullYear() === month.getFullYear() && t.date.getMonth() === month.getMonth()) {
      sum += +t.amount;
    } else {
      if (month !== null) {
        barChartData.push({ date: month, amount: sum });
      }
      sum = +t.amount;
      month = new Date(t.date.getFullYear(), t.date.getMonth());
    }
  }
  return barChartData;
}

export function transactionsReducer(state = initialState, action: TransactionsActions.transactionsActions) {
  console.log('transactionsReducer: Reducing action', action);

  switch (action.type) {
    case TransactionsActions.SET_TRANSACTIONS:
      console.log('transactionsReducer: Setting transactions: ', action.payload.length);
      return {
        ...state,
        transactions: action.payload,
      };
    case TransactionsActions.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case TransactionsActions.SELECT_CATEGORY:
      console.log('transactionsReducer: Selecting category: ', action.payload);
      const newState = determineSelectedTransactions(state, action.payload, state.selectedPeriod);
      return {
        ...newState,
        barChartData: getBarchartData(newState.selectedTransactions),
      }

    case TransactionsActions.UPDATE_STATE_TRANSACTION_CATEGORY:
      let index = -1;
      for (let i = 0; i < state.transactions.length; i++) {
        if (state.transactions[i].id === action.payload.id) {
          index = i;
          break;
        }
      }
      const updatedTransactions = [...state.transactions];
      updatedTransactions[index] = action.payload;
      return {
        ...state,
        transactions: updatedTransactions,
      }
    case TransactionsActions.SELECT_PERIOD:
      return determineSelectedTransactions(state, state.selectedCategory, action.payload);

    default:
      return state;
  }
}
