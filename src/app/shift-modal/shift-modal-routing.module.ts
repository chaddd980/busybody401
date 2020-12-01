import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShiftModalPage } from './shift-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ShiftModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShiftModalPageRoutingModule {}
