import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayHistoryPagePageRoutingModule } from './pay-history-page-routing.module';

import { PayHistoryPagePage } from './pay-history-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayHistoryPagePageRoutingModule
  ],
  declarations: [PayHistoryPagePage]
})
export class PayHistoryPagePageModule {}
