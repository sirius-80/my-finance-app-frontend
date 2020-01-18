import { Component, OnInit, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAccounts from './store/accounts.reducers';
import * as AccountsActions from './store/accounts.actions';
import { AppState } from '../store/app.reducers';
import { Category } from './accounts.model';


@Component({
  selector: 'app-accounts-rx',
  templateUrl: './accounts-rx.component.html',
  styleUrls: ['./accounts-rx.component.css']
})
export class AccountsRxComponent implements OnInit {
  accounts: Observable<fromAccounts.State>;
  categories: Observable<Category[]>;
  period: Observable<{start: Date, end: Date}>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.accounts = this.store.select('accounts');
    this.categories = this.store.select(state => state.accounts.categories);
    this.period = this.store.select(state => state.accounts.period);
  }

  onLoadData() {
    this.store.dispatch(new AccountsActions.LoadCategories());
    this.store.dispatch(new AccountsActions.LoadCombinedData());
    this.store.select(state => state.accounts.selectedCategory).subscribe(
      category => {
        this.store.dispatch(new AccountsActions.LoadAllCategoryData(category));
      }
    );
  }

  onCategory(categoryId: string) {
    console.log(categoryId);

    this.store.dispatch(new AccountsActions.SelectCategory(categoryId));
  }

  onGranularityChange(granularity: string) {
    this.store.dispatch(new AccountsActions.SetGranularity(granularity));
  }
}
