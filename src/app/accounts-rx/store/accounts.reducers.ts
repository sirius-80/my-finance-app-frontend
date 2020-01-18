import * as accountsActions from './accounts.actions';
import { Category, Combined } from '../accounts.model';


export interface CategoryData {
  category: Category;
  amount: number;
  children: CategoryData[];
}

export interface State  {
  categories: Category[];
  selectedCategory: Category;
  granularity: string;
  period: {start: Date, end: Date};
  categoryData: CategoryData;
  monthlyData: Combined[];
  yearlyData: Combined[];
}

const initialState: State = {
  categories: [
    new Category('0', 'Inkomsten'),
    new Category('10', 'Uitgaven'),
    new Category('1', 'Uitgaven'),
  ],
  selectedCategory: null,
  granularity: 'monthly',
  period: {
    start: new Date('2012-01-01'),
    end: new Date()
  },
  categoryData: null,
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
      }
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
    default:
      return state;
  }
}
