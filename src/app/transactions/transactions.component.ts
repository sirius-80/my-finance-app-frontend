import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';


import { AppState } from '../store/app.reducers';
import * as TransactionsActions from './store/transactions.actions';
import { Observable } from 'rxjs';
import { Category } from '../domain/category/category';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  public categories: Observable<Category[]>;
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.categories = this.store.select(state => state.domain.categories);
  }

  onLoadTransactions() {
    this.store.dispatch(new TransactionsActions.LoadTransactions({start: new Date(0), end: new Date()}));
  }

  onCategory(categoryId: string) {
    console.log('Selecting category with id', categoryId);
    this.store.select(state => state.domain.categories.filter((category) => category.id == categoryId)).pipe(
      first(),
      map(categories => {
        // console.log('Filtered categories:', categories);
        return new TransactionsActions.SelectCategory(categories[0]);
      }
    )).subscribe(selectCategoryAction => {
      // console.log('Dispatching selectCategoryAction', selectCategoryAction);
      this.store.dispatch(selectCategoryAction);
    });
  }
}
