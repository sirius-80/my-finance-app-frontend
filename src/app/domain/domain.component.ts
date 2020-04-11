import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from './store/domain.reducers';
import * as domainActions from './store/domain.actions';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
  constructor(private store: Store<State>) { }

  ngOnInit(): void {
  }

  onLoadCategories(): void {
    this.store.dispatch(new domainActions.LoadCategories());
  }

  onLoadAccounts(): void {
    this.store.dispatch(new domainActions.LoadAccounts());
  }

}
