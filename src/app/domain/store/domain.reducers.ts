import { Account } from '../account/account';
import { Category } from '../category/category';

export interface State  {
  accounts: Account[];
  categories: Category[]
}

const initialState: State = {
  accounts: [],
  categories: [],
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
      break;
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
      break;
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
