import { Action } from '@ngrx/store';
import { Combined, Balance } from '../accounts.model';
import { CategoryData } from './accounts.reducers';
import { Category } from 'src/app/domain/category/category';

export const SELECT_CATEGORY = '[Accounts] SELECT_CATEGORY';
export const SELECT_CATEGORY_BY_ID = '[Accounts] SELECT_CATEGORY_BY_ID';

export const LOAD_ALL_CATEGORY_DATA = '[Accounts] LOAD_ALL_CATEGORY_DATA';
export const LOAD_CATEGORY_DATA = '[Accounts] LOAD_CATEGORY_DATA';
export const SET_CATEGORY_DATA = '[Accounts] SET_CATEGORY_DATA';
export const LOAD_MONTHLY_CATEGORY_DATA = '[Accounts] LOAD_MONTHLY_CATEGORY_DATA';
export const SET_MONTHLY_CATEGORY_DATA = '[Accounts] SET_MONTHLY_CATEGORY_DATA';
export const LOAD_YEARLY_CATEGORY_DATA = '[Accounts] LOAD_YEARLY_CATEGORY_DATA';
export const SET_YEARLY_CATEGORY_DATA = '[Accounts] SET_YEARLY_CATEGORY_DATA';

export const LOAD_COMBINED_DATA = '[Accounts] LOAD_COMBINED_DATA';
export const LOAD_MONTHLY_COMBINED_DATA = '[Accounts] LOAD_MONTHLY_COMBINED_DATA';
export const SET_MONTHLY_COMBINED_DATA = '[Accounts] SET_MONTHLY_COMBINED_DATA';
export const LOAD_YEARLY_COMBINED_DATA = '[Accounts] LOAD_YEARLY_COMBINED_DATA';
export const SET_YEARLY_COMBINED_DATA = '[Accounts] SET_YEARLY_COMBINED_DATA';

export const SET_GRANULARITY = '[Accounts] SET_GRANULARITY';
export const SET_PERIOD = '[Accounts] SET_PERIOD';
export const SELECT_PERIOD = '[Accounts] SELECT_PERIOD';


export class LoadAllCategoryData implements Action {
  readonly type = LOAD_ALL_CATEGORY_DATA;
  constructor(public payload: Category) {}
}

export class LoadCategoryData implements Action {
  readonly type = LOAD_CATEGORY_DATA;
  constructor(public payload: Category) {}
}

export class SetCategoryData implements Action {
  readonly type = SET_CATEGORY_DATA;
  constructor(public payload: CategoryData[]) {}
}

export class SetMonthlyCategoryData implements Action {
  readonly type = SET_MONTHLY_CATEGORY_DATA;
  constructor(public payload: Balance[]) {}
}

export class LoadMonthlyCategoryData implements Action {
  readonly type = LOAD_MONTHLY_CATEGORY_DATA;
  constructor(public payload: Category) {}
}

export class LoadYearlyCategoryData implements Action {
  readonly type = LOAD_YEARLY_CATEGORY_DATA;
  constructor(public payload: Category) {}
}

export class SetYearlyCategoryData implements Action {
  readonly type = SET_YEARLY_CATEGORY_DATA;
  constructor(public payload: Balance[]) {}
}

export class LoadCombinedData implements Action {
  readonly type = LOAD_COMBINED_DATA;
}

export class LoadMonthlyCombinedData implements Action {
  readonly type = LOAD_MONTHLY_COMBINED_DATA;
}

export class LoadYearlyCombinedData implements Action {
  readonly type = LOAD_YEARLY_COMBINED_DATA;
}

export class SetMonthlyCombinedData implements Action {
  readonly type = SET_MONTHLY_COMBINED_DATA;
  constructor(public payload: Combined[]) {}
}

export class SetYearlyCombinedData implements Action {
  readonly type = SET_YEARLY_COMBINED_DATA;
  constructor(public payload: Combined[]) {}
}

export class SelectCategoryById implements Action {
  readonly type = SELECT_CATEGORY_BY_ID;
  constructor(public payload: string) {}
}

export class SelectCategory implements Action {
  readonly type = SELECT_CATEGORY;
  constructor(public payload: Category) {}
}

export class SetGranularity implements Action {
  readonly type = SET_GRANULARITY;
  constructor(public payload: string) {}
}

export class SetPeriod implements Action {
  readonly type = SET_PERIOD;
  constructor(public payload: {start: Date, end: Date}) {}
}

export class SelectPeriod implements Action {
  readonly type = SELECT_PERIOD;
  constructor(public payload: {start: Date, end: Date}) {}
}

export type accountsActions = SelectCategory
   | LoadAllCategoryData | LoadCategoryData | SetCategoryData
   | LoadMonthlyCategoryData | SetMonthlyCategoryData
   | LoadYearlyCategoryData | SetYearlyCategoryData
   | LoadCombinedData
   | LoadMonthlyCombinedData | SetMonthlyCombinedData
   | LoadYearlyCombinedData | SetYearlyCombinedData
   | SetGranularity
   | SetPeriod
   | SelectPeriod
   ;

