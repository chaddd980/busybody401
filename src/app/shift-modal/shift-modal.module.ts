import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShiftModalPageRoutingModule } from './shift-modal-routing.module';

import { ShiftModalPage } from './shift-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShiftModalPageRoutingModule
  ],
  declarations: [ShiftModalPage]
})
export class ShiftModalPageModule {}
