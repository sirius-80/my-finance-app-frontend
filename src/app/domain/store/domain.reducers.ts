import { Account } from '../account/account';
import { Category } from '../category/category';
import * as domainActions from './domain.actions';
export interface State  {
  accounts: Account[];
  categories: Category[];
}

const initialState: State = {
  accounts: [],
  categories: [],
};

export function domainReducer(state = initialState, action: domainActions.domainActions) {
  console.log('domainReducer: reducing action', action);
  switch (action.type) {
    case domainActions.SET_CATEGORIES:
      const categories = action.payload;
      for (const cat of categories) {
        if (cat.parent) {
          for (const parent of categories) {
            if (cat.parent.toString() === parent.id) {
              cat.parent = parent;
            }
          }
        } else {
          console.log('Leaving root-category unchanged', cat);
        }
      }
      return {
        ...state,
        categories
      };
    case domainActions.SET_ACCOUNTS:
      const accounts = action.payload;
      for (const account of accounts) {
        console.log('Loading account', account.name);
        for (const transaction of account.transactions) {
          transaction.account = account;
          if (transaction.category) {
            for (const category of state.categories) {
              // Note: transaction.category may be either a string (before it's resolved) or a Category (after resolving)
              // TODO #4: Create intermediate transaction class that explicitly has categoryId as a string
              if (transaction.category.toString() === category.id) {
                transaction.category = category;
              }
            }
          }
        }
        console.log('Account loaded');
      }
      return {
        ...state,
        accounts
      };
    default:
      return state;
  }
}
