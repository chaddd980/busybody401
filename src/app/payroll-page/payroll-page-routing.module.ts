import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayrollPagePage } from './payroll-page.page';

const routes: Routes = [
  {
    path: '',
    component: PayrollPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollPagePageRoutingModule {}
