import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestChangeModalPage } from './request-change-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RequestChangeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestChangeModalPageRoutingModule {}
