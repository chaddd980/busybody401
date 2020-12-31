import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit, OnDestroy {
  public user: any;
  public userAuth: Subscription;
  constructor(public fs: FirestoreService, public router: Router, private alertCtrl: AlertController,
              public toastController: ToastController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public ngOnInit() {
    this.getUser();
  }

  public async getUser() {
    try {
      const userRef = await this.fs.getStaffInfo();
      userRef.subscribe((user: any) => {
        this.user = user[0];
        console.log(this.user);
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 2000,
    });
    toast.present();
  }

  public onProfileClick() {
    this.router.navigate([ 'profile-page' ]);
  }

  public onPayrollClick() {
    if (this.user.payrollProcessing) {
      this.presentToast('The payroll info you submitted is being processed');
    } else if (this.user.payrollSetUp) {
      this.presentToast('Payroll has already been set up');
    } else {
      this.router.navigate([ 'payroll-page' ]);
    }
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
