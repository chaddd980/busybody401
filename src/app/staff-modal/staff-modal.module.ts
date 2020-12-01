import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffModalPageRoutingModule } from './staff-modal-routing.module';

import { StaffModalPage } from './staff-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffModalPageRoutingModule
  ],
  declarations: [StaffModalPage]
})
export class StaffModalPageModule {}
