import * as accountsActions from './accounts.actions';
import { Category } from 'src/app/accounts/accounts.model';


export interface State  {
  categories: Category[];
  selectedCategory: Category;
}

const initialState: State = {
  categories: [
    new Category('0', 'Inkomsten'),
    new Category('10', 'Uitgaven'),
    new Category('1', 'Uitgaven'),
  ],
  selectedCategory: null,
};

export function accountsReducer(state = initialState, action: accountsActions.accountsActions) {
  switch (action.type) {
    case accountsActions.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };
    case accountsActions.SELECT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    default:
      return state;
  }
}
