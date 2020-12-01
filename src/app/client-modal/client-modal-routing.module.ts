import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientModalPage } from './client-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ClientModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientModalPageRoutingModule {}
