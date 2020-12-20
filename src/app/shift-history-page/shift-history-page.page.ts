import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-shift-history-page',
  templateUrl: './shift-history-page.page.html',
  styleUrls: ['./shift-history-page.page.scss'],
})
export class ShiftHistoryPagePage implements OnInit {
  public userAuth: Subscription;
  public user: any;
  public shifts = [];

  constructor(public fs: FirestoreService, public router: Router, private location: Location) {
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
        console.log(this.user);
        this.getUserShifts();
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async getUserShifts() {
    try {
      const shiftsRef = await this.fs.getUserShifts(this.user);
      shiftsRef.subscribe((shifts: any) => {
        console.log(shifts);
        this.shifts = shifts.filter((data: any) => {
          return data.completed;
        });
        this.shifts.sort(this.sortShifts);
        this.shifts.reverse();
      });
    } catch (err) {
      console.log(err);
    }
  }

  public sortShifts(a: any, b: any) {
    if (a.dateStartTime.seconds < b.dateStartTime.seconds) {
      return -1;
    } else if (a.dateStartTime.seconds > b.dateStartTime.seconds) {
      return 1;
    } else {
      return 0;
    }
  }

  public back() {
    this.location.back();
  }

}
