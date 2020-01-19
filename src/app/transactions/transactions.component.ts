import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';


import { AppState } from '../store/app.reducers';
import * as TransactionsActions from './store/transactions.actions';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  onLoadTransactions() {
    this.store.dispatch(new TransactionsActions.LoadCategories());
    this.store.dispatch(new TransactionsActions.LoadTransactions({start: new Date('2020-01-01'), end: new Date()}));
  }
}
