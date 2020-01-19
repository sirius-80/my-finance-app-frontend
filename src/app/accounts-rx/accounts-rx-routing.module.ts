import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsRxComponent } from './accounts-rx.component';
import { CategoryComponent } from './category/category.component';

const accountsRxRoutes: Routes = [
  { path: 'accounts-rx', component: AccountsRxComponent, children: [
    { path: ':categoryId', component: CategoryComponent }
  ] },
];

@NgModule({
  imports: [
    RouterModule.forChild(accountsRxRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountsRxRoutingModule {}
