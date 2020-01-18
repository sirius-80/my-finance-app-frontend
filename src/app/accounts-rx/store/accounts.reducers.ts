import * as accountsActions from './accounts.actions';
import { Category, Combined, Balance } from '../accounts.model';


export interface CategoryData {
  category: Category;
  amount: number;
  children: CategoryData[];
}

export interface CategoryPeriodicData {
  category: Category;
  amount: number;
  date: Date;
}

export interface State  {
  categories: Category[];
  selectedCategory: Category;
  granularity: string;
  period: {start: Date, end: Date};
  categoryData: CategoryData[];
  categoryMonthlyData: Balance[];
  categoryYearlyData: Balance[];
  monthlyData: Combined[];
  yearlyData: Combined[];
}

const initialState: State = {
  categories: [],
  selectedCategory: null,
  granularity: 'monthly',
  period: {
    start: new Date('1970-01-01'),
    end: new Date()
  },
  categoryData: null,
  categoryMonthlyData: [],
  categoryYearlyData: [],
  monthlyData: [],
  yearlyData: [],
};

export function accountsReducer(state = initialState, action: accountsActions.accountsActions) {
  switch (action.type) {
    case accountsActions.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case accountsActions.SELECT_CATEGORY:
      let selected = null;
      for (const cat of state.categories) {
        if (cat.id === action.payload) {
          selected = cat;
          break;
        }
      }
      return {
        ...state,
        selectedCategory: selected
      };
    case accountsActions.SET_GRANULARITY:
      return {
        ...state,
        granularity: action.payload
      };
    case accountsActions.SET_PERIOD:
      return {
        ...state,
        period: action.payload,
      };
    case accountsActions.SET_MONTHLY_COMBINED_DATA:
      return {
        ...state,
        monthlyData: action.payload,
      };
      break;
    case accountsActions.SET_YEARLY_COMBINED_DATA:
      return {
        ...state,
        yearlyData: action.payload,
      };
      break;
    case accountsActions.SET_CATEGORY_DATA:
      return {
        ...state,
        categoryData: action.payload,
      };
    case accountsActions.SET_MONTHLY_CATEGORY_DATA:
      return {
        ...state,
        categoryMonthlyData: action.payload,
      };
    default:
      return state;
  }
}
