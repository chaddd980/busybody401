import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(public fs: FirestoreService, public router: Router, private location: Location) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      // this.user = user;
      // console.log(this.user);
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public ngOnInit() {
  }

  public back() {
    this.location.back();
  }

}
