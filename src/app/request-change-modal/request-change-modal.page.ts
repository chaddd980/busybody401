import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

import {
  format,
} from 'date-fns';

@Component({
  selector: 'app-request-change-modal',
  templateUrl: './request-change-modal.page.html',
  styleUrls: ['./request-change-modal.page.scss'],
})
export class RequestChangeModalPage implements OnInit {
  @Input() public shift: any;
  @Input() public user: any;
  public startDate: any;
  public endDate: any;

  constructor(private alertCtrl: AlertController, public modalCtrl: ModalController, public fs: FirestoreService) { }

  public ngOnInit() {
    console.log(this.shift);
    console.log(this.user);
  }

  public async changeAlert() {
    let alert: any;
    if (this.startDate && this.endDate) {
      const date = format(this.startDate, 'MMM Lo y');
      const start = format(this.startDate, 'h:mm aaaa');
      const end = format(this.endDate, 'h:mm aaaa');
      alert = await this.alertCtrl.create({
        header: 'Confirm Change',
        subHeader: 'Did you complete this shift on ' + date + ' from ' + start + ' to ' + end + '?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel Confirm');
            },
          },
          {
            text: 'Yes',
            handler: () => {
              this.requestChange();
            },
          },
        ],
      });
    } else {
      alert = await this.alertCtrl.create({
        header: 'Confirm Change',
        subHeader: 'Please chose a start and end date and time',
        buttons: [
          {
            text: 'Okay',
            role: 'cancel',
            handler: () => {
              console.log('Cancel Confirm');
            },
          },
        ],
      });
    }
    alert.present();
  }

  public async requestChange() {
    try {
      console.log(this.startDate);
      console.log(this.endDate);
      console.log(this.user);
      this.shift.requestedClockInTime = new Date(this.startDate);
      this.shift.requestedClockOutTime = new Date(this.endDate);
      this.shift.request = true;
      await this.fs.updateShiftInfo(this.shift, this.shift.id, this.user);
      this.dismiss();
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

}
