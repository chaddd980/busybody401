import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaffModalPage } from './staff-modal.page';

const routes: Routes = [
  {
    path: '',
    component: StaffModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffModalPageRoutingModule {}
