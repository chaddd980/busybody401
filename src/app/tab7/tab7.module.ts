import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Tab7PageRoutingModule } from './tab7-routing.module';

import { Tab7Page } from './tab7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: Tab7Page }]),
    Tab7PageRoutingModule
  ],
  declarations: [Tab7Page]
})
export class Tab7PageModule {}
