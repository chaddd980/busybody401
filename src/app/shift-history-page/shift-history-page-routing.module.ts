import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftHistoryPagePage } from './shift-history-page.page';

const routes: Routes = [
  {
    path: '',
    component: ShiftHistoryPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftHistoryPagePageRoutingModule {}
