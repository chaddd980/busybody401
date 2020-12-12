import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

import {
  addDays,
  addHours,
  addMinutes,
  endOfDay,
  startOfDay,
} from 'date-fns';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  public userAuth: Subscription;
  public admin: false;
  public currentTimestamp: number;
  public nextShift: any;
  public clockInOut = 'Clock In';
  public shiftMessage = 'You do not have any upcoming shifts.';
  public time = '1h 5m';
  public days: number;
  public hours: number;
  public minutes: number;
  public seconds: number;
  public clockedIn = false;
  public shifts = [];
  public upcomingShifts = [];
  public unfinishedShifts = [];
  public user: any;
  public clockedInTime = null;
  public clockedOutTime = null;
  public finalShiftPay = 0;
  public interval: any;
  public userRef: any;
  constructor(public fs: FirestoreService,
              public router: Router,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (!user) {
        this.router.navigate([ 'signin' ]);
      } else {
        console.log(user);
      }
    });
    const date = new Date();
    this.currentTimestamp = date.valueOf();
  }

  public async ngOnInit() {
    try {
      await this.getUser();
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

  public updateShift(clockedIn: any, clockedOut: any) {
    const shift = {
      id: this.nextShift.id,
      address: this.nextShift.address,
      assigned: true,
      break: this.nextShift.break,
      client: this.nextShift.client,
      dateStartTime: this.nextShift.dateStartTime,
      dateEndTime: this.nextShift.dateEndTime,
      hours: this.nextShift.hours,
      jobTitle: this.nextShift.jobTitle,
      assignedTo: this.nextShift.assignedTo,
      perHour: this.nextShift.perHour,
      pay: this.nextShift.pay,
      payMultiplier: this.nextShift.payMultiplier,
      shiftInfo: this.nextShift.shiftInfo,
      completed: this.nextShift.completed,
      clockedIn,
      clockedOut,
      clockedInTime: this.clockedInTime,
      clockedOutTime: this.clockedOutTime,
      finalShiftPay: this.finalShiftPay,
    };
    this.fs.updateShift(shift, shift.id, this.user);
  }

  public clockIn() {
    if (!this.nextShift.clockedOut) {
      this.clockedIn = true;
      this.clockInOut = 'Clock Out';
      this.clockedInTime = new Date();
      const shift = this.nextShift;
      shift.clockedIn = true;
      shift.clockedInTime = this.clockedInTime;
      this.fs.updateShiftInfo(shift, shift.id, this.user);
    }
  }

  public async requestChangeAlert(shift: any) {
    console.log(shift);
    const alert = await this.alertCtrl.create({
      
    })
  }

  public async confirmShiftAlert(shift: any) {

  }

  public async requestChange(shift: any) {
    try {
      console.log(shift);
    } catch (err) {
      console.log(err);
    }
  }
  public async confirmShift(shift: any) {
    try {
      console.log(shift);
    } catch (err) {
      console.log(err);
    }
  }

  public clockOut() {
    if (this.nextShift.clockedIn) {
      this.clockedIn = false;
      this.clockInOut = 'Clock In';
      const testTime = new Date();
      let clockedOutTime = addHours(testTime, 9);
      clockedOutTime = addMinutes(clockedOutTime, 8);
      console.log(this.nextShift.clockedInTime);
      console.log(clockedOutTime);
      console.log(clockedOutTime.valueOf());
      const shiftTime = (clockedOutTime.valueOf() * 1000) - (this.nextShift.clockedInTime.seconds * 1000);
      console.log(shiftTime);
      const shift = this.nextShift;
      if (!shift.hours[1]) {
        const hours = [Math.floor((shiftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0];
        console.log(hours);
        shift.completedHours = hours;
        shift.clockedOut = true;
        shift.clockedOutTime = clockedOutTime;
        shift.clockedIn = false;
        shift.completed = true;
      } else {
        const endofStartDate = endOfDay(shift.clockedInTime.toDate());
        const startofEndDate = startOfDay(clockedOutTime);
        const firstShiftTime = (endofStartDate.valueOf()) - (shift.clockedInTime.seconds * 1000);
        const secondShiftTime = (clockedOutTime.valueOf()) - (startofEndDate.valueOf());
        console.log(endofStartDate);
        let hourOne = Math.floor((firstShiftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let hourTwo = Math.floor((secondShiftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minOne = Math.floor((firstShiftTime % (1000 * 60 * 60)) / (1000 * 60));
        let minTwo = Math.floor((secondShiftTime % (1000 * 60 * 60)) / (1000 * 60));
        const testOne = (Math.round((minOne / 60) * 10) / 10).toFixed(1);
        const testTwo = (Math.round((minTwo / 60) * 10) / 10).toFixed(1);
        minOne = Number(testOne);
        minTwo = Number(testTwo);
        hourOne += minOne;
        hourTwo += minTwo;
        const hours = [hourOne, hourTwo];
        console.log(hours);
        shift.completedHours = hours;
        shift.clockedOut = true;
        shift.clockedOutTime = clockedOutTime;
        shift.clockedIn = false;
        shift.completed = true;
        console.log(shift);
      }
      this.fs.updateShiftInfo(shift, shift.id, this.user);
    }
  }

  public async calculate() {
    try {
      if (this.upcomingShifts) {
        for (const shift of this.upcomingShifts) {
          const shiftStartTime = shift.dateStartTime.seconds * 1000;
          const shiftEndTime = shift.dateEndTime.seconds * 1000;
          console.log(shiftStartTime);
          console.log(shiftEndTime);
          console.log(this.currentTimestamp);
          // this.getShiftInfo(shiftStartTime, shiftEndTime);
          if (shiftStartTime <= this.currentTimestamp && shiftEndTime >= this.currentTimestamp && !shift.clockedOut) {
            this.nextShift = shift;
            this.clockedIn = this.nextShift.clockedIn;
            if (this.clockedIn) {
              this.clockInOut = 'Clock Out';
            } else {
              this.clockInOut = 'Clock In';
            }
            console.log(this.clockedIn);
            console.log(shiftStartTime);
            console.log(shiftEndTime);
            this.getShiftInfo(shiftStartTime, shiftEndTime);
            break;
          } else if (shiftStartTime > this.currentTimestamp && !shift.clockedOut) {
            this.nextShift = shift;
            this.clockedIn = this.nextShift.clockedIn;
            if (this.clockedIn) {
              this.clockInOut = 'Clock Out';
            } else {
              this.clockInOut = 'Clock In';
            }
            console.log(this.clockedIn);
            console.log(this.nextShift);
            console.log(shiftStartTime);
            console.log(shiftEndTime);
            this.getShiftInfo(shiftStartTime, shiftEndTime);
            break;
          }
        }
      }
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
        this.shifts = shifts;
        this.shifts.sort(this.sortShifts);
        this.upcomingShifts = this.shifts.filter((data: any) => {
          let unFinishedShift: any;
          if (!data.clockedOut) {
            unFinishedShift = data;
            return unFinishedShift.dateEndTime.seconds * 1000 >= this.currentTimestamp;
          }
        });
        this.unfinishedShifts = this.shifts.filter((data: any) => {
          let unfinishedShifts: any;
          if (!data.clockedOut) {
            unfinishedShifts = data;
            return unfinishedShifts.dateEndTime.seconds * 1000 < this.currentTimestamp;
          }
        });
        console.log(this.upcomingShifts);
        console.log(this.unfinishedShifts);
        console.log(this.shifts);
        if (this.upcomingShifts) {
          this.calculate();
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  // public async getShifts() {
  //   try {
  //     this.shifts = user[0].shifts;
  //     console.log(this.shifts[0].dateStartTime);
  //     console.log(this.shifts[0].dateEndTime);
  //     this.shifts.sort(this.sortShifts);
  //     this.upcomingShifts = this.shifts.filter((data: any) => {
  //       let unFinishedShift: any;
  //       if (!data.clockedOut) {
  //         unFinishedShift = data;
  //         return unFinishedShift.dateEndTime.seconds * 1000 >= this.currentTimestamp;
  //       }
  //     });
  //     console.log(this.upcomingShifts);
  //     console.log(this.shifts);
  //     if (this.shifts) {
  //       this.calculate();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  public getShiftInfo(shiftStartTime: number, shiftEndTime?: number) {
    console.log(shiftStartTime, shiftEndTime);
    this.interval =  setInterval(() => {
      console.log(shiftStartTime, shiftEndTime);
      const date = new Date();
      let timeBeforeShift: number;
      this.currentTimestamp = date.valueOf();
      if (this.clockedIn) {
        timeBeforeShift = shiftEndTime - this.currentTimestamp;
        this.shiftMessage = 'Your shift ends in: ';
      } else {
        if (shiftStartTime < this.currentTimestamp) {
          timeBeforeShift = this.currentTimestamp - shiftStartTime;
          this.shiftMessage = 'You are late by: ';
        } else {
          timeBeforeShift = shiftStartTime - this.currentTimestamp;
          this.shiftMessage = 'Your shift starts in: ';
        }
      }
      console.log(shiftStartTime);
      console.log(shiftEndTime);
      console.log(timeBeforeShift);
      this.days = Math.floor(timeBeforeShift / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((timeBeforeShift % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((timeBeforeShift % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((timeBeforeShift % (1000 * 60)) / 1000);
      // console.log(this.days);
      // console.log(this.hours);
      // console.log(this.minutes);
      // console.log(this.seconds);
    }, 1000);
  }

  public ngOnDestroy() {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
