import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftHistoryPagePageRoutingModule } from './shift-history-page-routing.module';

import { ShiftHistoryPagePage } from './shift-history-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShiftHistoryPagePageRoutingModule
  ],
  declarations: [ShiftHistoryPagePage]
})
export class ShiftHistoryPagePageModule {}
