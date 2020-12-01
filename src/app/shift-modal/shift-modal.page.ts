import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-shift-modal',
  templateUrl: './shift-modal.page.html',
  styleUrls: ['./shift-modal.page.scss'],
})
export class ShiftModalPage implements OnInit {
  public clients: any;
  public clientChosen: string;
  public jobType: string;
  public pay: string;
  public shiftInfo: string;
  public startDate: any;
  public startTime: any;
  public endDate: any;
  public endTime: any;

  constructor(public fs: FirestoreService, public modalCtrl: ModalController) { }

  public ngOnInit() {
    this.getClients();
  }

  public async getClients() {
    try {
      const clients = await this.fs.getClients();
      if (clients) {
        clients.subscribe((data: any) => {
          console.log(data);
          this.clients = data;
        });
      } else {
        throw new Error('failed getting shifts');
      }
    } catch (err) {
      console.log(err);
    }
  }

  public dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

  public createShift() {
    console.log(this.clientChosen);
  }

}
