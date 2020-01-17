import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountsRxComponent } from './accounts-rx/accounts-rx.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'accounts', component: AccountsComponent },
  { path: 'accounts-rx', component: AccountsRxComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
