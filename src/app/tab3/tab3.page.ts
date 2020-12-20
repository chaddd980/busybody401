import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit, OnDestroy {
  public userAuth: Subscription;
  constructor(public fs: FirestoreService, public router: Router, private alertCtrl: AlertController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public ngOnInit() {
  }

  public onProfileClick() {
    this.router.navigate([ 'profile-page' ]);
  }

  public onPayrollClick() {
    this.router.navigate([ 'payroll-page' ]);
  }

  public onShiftClick() {
    this.router.navigate([ 'shift-history-page' ]);
  }

  public onPayClick() {
    this.router.navigate([ 'pay-history-page' ]);
  }

  public async signout() {
    try {
      await this.fs.signout();
      await this.router.navigate([ 'signin' ]);
    } catch (error) {
      console.log(error);
    }
  }

  public async signoutAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Are You Sure You Want to Signout?',
      // subHeader: 'Must be 15 minutes or less to clock in',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel Signout');
          },
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Signout');
            this.signout();
          },
        },
      ],
    });
    await alert.present();
  }

  public ngOnDestroy() {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
