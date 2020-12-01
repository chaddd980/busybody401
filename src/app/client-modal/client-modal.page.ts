import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-client-modal',
  templateUrl: './client-modal.page.html',
  styleUrls: ['./client-modal.page.scss'],
})
export class ClientModalPage implements OnInit {

  constructor(public modalCtrl: ModalController, public fs: FirestoreService) { }

  public ngOnInit() {
    this.getShifts();
  }

  public async getShifts() {
    const shifts = this.fs.getShifts();
    console.log(shifts);
  }

  public dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

}
