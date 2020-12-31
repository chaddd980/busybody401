import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-payroll-page',
  templateUrl: './payroll-page.page.html',
  styleUrls: ['./payroll-page.page.scss'],
})
export class PayrollPagePage implements OnInit {
  public userAuth: Subscription;
  public provinceSelected: string;
  public address: string;
  public apt: string;
  public city: string;
  public postal: string;
  public transit: string;
  public branch: string;
  public accountNumber: string;
  public sin: string;
  public dob: any;
  public user: any;

  public provinces = [
    'AB',
    'BC',
    'MB',
    'NB',
    'NL',
    'NS',
    'NT',
    'NU',
    'ON',
    'QC',
    'PE',
    'SK',
    'YT',
  ];

  constructor(public fs: FirestoreService, public router: Router, private location: Location, public toastController: ToastController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      // this.user = user;
      // console.log(this.user);
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public ngOnInit() {
    this.getUser();
  }

  public async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 2000,
    });
    toast.present();
  }

  public validateSin() {
    if (!this.sin) {
      this.presentToast('Please Enter SIN');
    } else if (this.sin.length !== 9) {
      console.log(this.sin);
      this.presentToast('SIN must be 9 numbers');
    } else {
      this.validatePostal();
    }
  }

  public validatePostal() {
    if (!this.postal) {
      this.presentToast('Please Enter Postal');
    } else if (this.postal.split(' ').join('').length !== 6)  {
      this.presentToast('Postal Code Invalid');
    } else {
      this.validate();
    }
  }

  public validate() {
    if (!this.dob) {
      this.presentToast('Please Enter Date of Birth');
    } else if (!this.address) {
      this.presentToast('Please Enter Address');
    } else if (!this.provinceSelected) {
      this.presentToast('Please Enter Province');
    } else if (!this.city) {
      this.presentToast('Please Enter City');
    } else if (!this.transit) {
      this.presentToast('Please Enter Transit Number');
    } else if (!this.branch) {
      this.presentToast('Please Enter Branch Number');
    } else if (!this.accountNumber) {
      this.presentToast('Please Enter Account Number');
    } else {
      this.updateUser();
    }
  }

  // public validateTransit() {
  //   if (!this.transit) {
  //     this.presentToast('Please Enter Transit Number');
  //   } else {
  //     this.validateBranch();
  //   }
  // }
  //
  // public validateBranch() {
  //   if (!this.branch) {
  //     this.presentToast('Please Enter Branch Number');
  //   } else {
  //     this.validateBranch();
  //   }
  // }
  //
  // public validateAccount() {
  //   if (!this.accountNumber) {
  //     this.presentToast('Please Enter Account Number');
  //   } else {
  //     console.log('All valid');
  //     this.updateUser();
  //   }
  // }

  public async updateUser() {
    try {
      this.user.sin = this.sin;
      this.user.dob = this.dob;
      if (this.apt) {
        this.user.address = this.address + ' Apt ' + this.apt + ', ' + this.city + ' ' + this.provinceSelected + ', ' + this.postal;
      } else {
        this.user.address = this.address + ', ' + this.city + ' ' + this.provinceSelected + ', ' + this.postal;
      }
      this.user.transit = this.transit;
      this.user.branch = this.branch;
      this.user.accountNumber = this.accountNumber;
      this.user.payrollProcessing = true;
      console.log(this.user);
      this.fs.updateStaff(this.user);
    } catch (err) {
      console.log(err);
    }
  }

  public taxClick() {
    console.log(this.sin);
    console.log(this.dob);
  }

  public done() {
    this.validateSin();
    // this.validateDOB();
    // this.validateAddress();
    // this.validateProvince();
    // this.validateCity();
    // this.validatePostal();
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

  public back() {
    this.location.back();
  }

}
