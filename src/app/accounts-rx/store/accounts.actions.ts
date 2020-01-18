import { Action } from '@ngrx/store';
import { Category, Combined } from '../accounts.model';

export const LOAD_CATEGORIES = 'LOAD_CATEGORIES';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SELECT_CATEGORY = 'SELECT_CATEGORY';
export const LOAD_MONTHLY_COMBINED_DATA = 'LOAD_MONTHLY_COMBINED_DATA';
export const LOAD_COMBINED_DATA = 'LOAD_COMBINED_DATA';
export const LOAD_YEARLY_COMBINED_DATA = 'LOAD_YEARLY_COMBINED_DATA';
export const SET_MONTHLY_COMBINED_DATA = 'SET_MONTHLY_COMBINED_DATA';
export const SET_YEARLY_COMBINED_DATA = 'SET_YEARLY_COMBINED_DATA';
export const SET_GRANULARITY = 'SET_GRANULARITY';
export const SET_PERIOD = 'SET_PERIOD';

export class LoadCategories implements Action {
  readonly type = LOAD_CATEGORIES;
}

export class LoadCombinedData implements Action {
  readonly type = LOAD_COMBINED_DATA;
  constructor(public payload: string) {}
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

export class SetCategories implements Action {
  readonly type = SET_CATEGORIES;
  constructor(public payload: Category[]) {}
}

export class SelectCategory implements Action {
  readonly type = SELECT_CATEGORY;
  constructor(public payload: string) {}
}

export class SetGranularity implements Action {
  readonly type = SET_GRANULARITY;
  constructor(public payload: string) {}
}

export class SetPeriod implements Action {
  readonly type = SET_PERIOD;
  constructor(public payload: {start: Date, end: Date}) {}
}

export type accountsActions = LoadCategories | SetCategories | SelectCategory
   | LoadCombinedData
   | LoadMonthlyCombinedData | SetMonthlyCombinedData
   | LoadYearlyCombinedData | SetYearlyCombinedData
   | SetGranularity
   | SetPeriod
   ;

