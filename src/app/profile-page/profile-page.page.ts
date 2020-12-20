import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {
  public userAuth: Subscription;
  public user: any;
  public initials: string;
  public editing = false;
  constructor(public fs: FirestoreService, public router: Router, private location: Location, public alertController: AlertController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      // this.user = user;
      // console.log(this.user);
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public async ngOnInit() {
    try {
      await this.getUser();
    } catch (err) {
      console.log(err);
    }
  }

  public async getUser() {
    try {
      const userRef = await this.fs.getStaffInfo();
      userRef.subscribe((user: any) => {
        this.user = user[0];
        const names = this.user.name.split(' ');
        this.initials = names[0][0] + names[1][0];
        console.log(this.user);
        console.log(this.initials);
      });
    } catch (err) {
      console.log(err);
    }
  }

  public edit() {
    this.editing = !this.editing;
  }

  public async editItem(item: string) {
    try {
      console.log(item);
      this.presentAlert(item);
    } catch (err) {
      console.log(err);
    }
  }

  public async presentAlert(item: string) {
    const alert = await this.alertController.create({
      header: 'Change Your ' + item,
      inputs: [
        {
          name: item,
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        }, {
          text: 'Ok',
          handler: (data: any) => {
            console.log(data);
            console.log(Object.keys(data));
            console.log(Object.keys(data)[0]);
            if (Object.keys(data)[0] === 'name') {
              this.user.name = data.name;
              this.updateUser();
            } else {
              this.user.pNumber = data.pNumber;
              this.updateUser();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  public async updateUser() {
    try {
      console.log(this.user);
      this.fs.updateStaff(this.user);
    } catch (err) {
      console.log(err);
    }
  }

  public back() {
    this.location.back();
  }

}
