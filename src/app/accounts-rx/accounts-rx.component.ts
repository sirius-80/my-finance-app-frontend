import { Component, OnInit, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAccounts from './store/accounts.reducers';
import * as AccountsActions from './store/accounts.actions';
import { AppState } from '../store/app.reducers';


@Component({
  selector: 'app-accounts-rx',
  templateUrl: './accounts-rx.component.html',
  styleUrls: ['./accounts-rx.component.css']
})
export class AccountsRxComponent implements OnInit {
  accounts: Observable<fromAccounts.State>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.accounts = this.store.select('accounts');
  }

  onLoadCategories() {
    console.log('Dispatching LOAD_CATEGORIES');
    this.store.dispatch(new AccountsActions.LoadCategories());
  }

  onCategory(category) {
    console.log(category);

  }
}
