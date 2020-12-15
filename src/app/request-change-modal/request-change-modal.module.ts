import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestChangeModalPageRoutingModule } from './request-change-modal-routing.module';

import { RequestChangeModalPage } from './request-change-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestChangeModalPageRoutingModule
  ],
  declarations: [RequestChangeModalPage]
})
export class RequestChangeModalPageModule {}
