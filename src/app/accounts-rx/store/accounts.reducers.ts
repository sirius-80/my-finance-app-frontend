import * as accountsActions from './accounts.actions';
import { Combined, Balance } from '../accounts.model';
import { Category } from 'src/app/domain/category/category';


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
  // categories: Category[];
  selectedCategory: Category;
  granularity: string;
  period: {start: Date, end: Date};
  categoryData: CategoryData[];
  categoryMonthlyData: Balance[];
  categoryYearlyData: Balance[];
  currentCategoryData: Balance[];
  monthlyData: Combined[];
  yearlyData: Combined[];
  currentData: Combined[];
  selectedPeriod: {start: Date, end: Date};
}

const initialState: State = {
  // categories: [],
  selectedCategory: null,
  granularity: 'monthly',
  period: {
    start: new Date(0),
    end: new Date()
  },
  categoryData: null,
  categoryMonthlyData: [],
  categoryYearlyData: [],
  currentCategoryData: [],
  monthlyData: [],
  yearlyData: [],
  currentData: [],
  selectedPeriod: null,
};

export function accountsReducer(state = initialState, action: accountsActions.accountsActions) {
  console.log('accountsReducer: reducing action', action);
  switch (action.type) {
    case accountsActions.SELECT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    case accountsActions.SET_GRANULARITY:
      let categoryData = state.categoryMonthlyData;
      let balanceData = state.monthlyData;
      if (action.payload === 'yearly') {
        categoryData = state.categoryYearlyData;
        balanceData = state.yearlyData;
      }
      return {
        ...state,
        granularity: action.payload,
        currentCategoryData: categoryData,
        currentData: balanceData,
      };
    case accountsActions.SET_PERIOD:
      return {
        ...state,
        period: action.payload,
      };
    case accountsActions.SET_MONTHLY_COMBINED_DATA:
      let currentData = action.payload;
      if (state.granularity === 'yearly') {
        currentData = state.yearlyData;
      }
      return {
        ...state,
        monthlyData: action.payload,
        currentData,
      };
    case accountsActions.SET_YEARLY_COMBINED_DATA:
      let currentData2 = action.payload;
      if (state.granularity === 'monthly') {
        currentData2 = state.monthlyData;
      }
      return {
        ...state,
        yearlyData: action.payload,
        currentData: currentData2,
      };
    case accountsActions.SET_CATEGORY_DATA:
      return {
        ...state,
        categoryData: action.payload,
      };
    case accountsActions.SET_MONTHLY_CATEGORY_DATA:
      let currentCategoryData = action.payload;
      if (state.granularity === 'yearly') {
        currentCategoryData = state.categoryYearlyData;
      }
      return {
        ...state,
        categoryMonthlyData: action.payload,
        currentCategoryData,
      };
    case accountsActions.SET_YEARLY_CATEGORY_DATA:
      let currentCategoryData2 = action.payload;
      if (state.granularity === 'monthly') {
        currentCategoryData2 = state.categoryMonthlyData;
      }
      return {
        ...state,
        categoryYearlyData: action.payload,
        currentCategoryData: currentCategoryData2,
      };
    case accountsActions.SELECT_PERIOD:
      return {
        ...state,
        selectedPeriod: action.payload,
      };
    default:
      return state;
  }
}
