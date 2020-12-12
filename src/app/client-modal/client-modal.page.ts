import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-client-modal',
  templateUrl: './client-modal.page.html',
  styleUrls: ['./client-modal.page.scss'],
})
export class ClientModalPage implements OnInit {
  public name: string;
  public clientType: string;
  public address: string;
  public city: string;
  public province: string;
  public postalCode: string;
  public apt = '';
  public extra = '';

  constructor(public modalCtrl: ModalController, public fs: FirestoreService) { }

  public ngOnInit() {
    this.getShifts();
  }

  public async getShifts() {
    const shifts = this.fs.getShifts();
    console.log(shifts);
  }

  public async  dismiss() {
    try {
      this.modalCtrl.dismiss({
        dismissed: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async createClient() {
    try {
      const newClient = {
        address: this.address + ', ' + this.city + ' ' + this.province + ', ' + this.postalCode,
        apt: this.apt,
        extraInfo: this.extra,
        clientType: this.clientType,
        name: this.name,
      };
      console.log(newClient);
      await this.fs.createClient(newClient);
      await this.dismiss();
    } catch (err) {
      console.log(err);
    }
  }

}
