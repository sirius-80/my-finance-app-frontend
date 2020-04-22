import { Component, OnInit, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAccounts from './store/accounts.reducers';
import * as AccountsActions from './store/accounts.actions';
import { AppState } from '../store/app.reducers';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Category } from '../domain/category/category';


@Component({
  selector: 'app-accounts-rx',
  templateUrl: './accounts-rx.component.html',
  styleUrls: ['./accounts-rx.component.css']
})
export class AccountsRxComponent implements OnInit {
  accounts: Observable<fromAccounts.State>;
  categories: Observable<Category[]>;
  period: Observable<{start: Date, end: Date}>;

  constructor(private store: Store<AppState>,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.accounts = this.store.select('accounts');
    this.categories = this.store.select(state => state.domain.categories);
    this.period = this.store.select(state => state.accounts.period);
    this.store.select(state => state.domain.categories).pipe(
      map((categories) => {
          this.onCategory(categories[0].id);
        }
    ));
  }

  onLoadData() {
    // this.store.dispatch(new AccountsActions.LoadCombinedData());
    this.store.select(state => state.accounts.selectedCategory).subscribe(
      category => {
        console.log('Dispatching LoadAllCategoryData for category, ', category);
        if (category) {
          return this.store.dispatch(new AccountsActions.LoadAllCategoryData(category));
        }
      }
    );
  }

  onCategory(categoryId: string) {
    console.log('onCategory', categoryId);
    this.router.navigate([categoryId], {relativeTo: this.route});
    this.store.dispatch(new AccountsActions.SelectCategoryById(categoryId));
  }

  onGranularityChange(granularity: string) {
    this.store.dispatch(new AccountsActions.SetGranularity(granularity));
  }
}
