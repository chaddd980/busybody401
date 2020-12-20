import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayHistoryPagePage } from './pay-history-page.page';

const routes: Routes = [
  {
    path: '',
    component: PayHistoryPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayHistoryPagePageRoutingModule {}
