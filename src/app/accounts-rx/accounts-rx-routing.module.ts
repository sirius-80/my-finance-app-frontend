import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsRxComponent } from './accounts-rx.component';

const accountsRxRoutes: Routes = [
  { path: 'accounts-rx', component: AccountsRxComponent },
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
