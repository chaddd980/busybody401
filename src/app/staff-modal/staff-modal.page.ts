import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-staff-modal',
  templateUrl: './staff-modal.page.html',
  styleUrls: ['./staff-modal.page.scss'],
})
export class StaffModalPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  public ngOnInit() {
  }

  public dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

}
