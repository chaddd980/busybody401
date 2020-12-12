import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

import {
  addDays,
  addHours,
  endOfDay,
  endOfMonth,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
} from 'date-fns';

@Component({
  selector: 'app-shift-modal',
  templateUrl: './shift-modal.page.html',
  styleUrls: ['./shift-modal.page.scss'],
})
export class ShiftModalPage implements OnInit {
  @Input() public shift: any;
  @Input() public duplicate: any;
  public clients: any;
  public clientChosen: any;
  public staffChosen: any;
  public staffs: any;
  public jobType: string;
  public pay: number;
  public break = 0;
  public shiftInfo: string;
  public startDate: any;
  public startTime: any;
  public endDate: any;
  public endTime: any;
  public pay1 = 1;
  public pay2 = 1;
  public created = false;
  public hours: any;
  public overallPay: any;
  public completed = false;
  public payMultiplier: any;

  constructor(public fs: FirestoreService, public modalCtrl: ModalController, public navParams: NavParams,
              private toastController: ToastController) {
  }

  public async ngOnInit() {
    try {
      await this.getClients();
      await this.getStaff();
      if (this.shift) {
        console.log(this.shift.dateStartTime.toDate());
        this.clientChosen = {
          address: this.shift.address,
          client: this.shift.client,
        };
        this.jobType = this.shift.jobTitle;
        this.break = this.shift.break * 60;
        this.shiftInfo = this.shift.shiftInfo;
        this.startDate = this.shift.dateStartTime.toDate();
        this.endDate = this.shift.dateEndTime.toDate();
        this.hours = this.shift.hours;
        this.pay1 = this.shift.payMultiplier[0];
        this.pay2 = this.shift.payMultiplier[1];
        this.payMultiplier = this.shift.payMultiplier;
        if (this.shift.assignedTo) {
          this.staffChosen = this.shift.assignedTo;
          this.pay = this.shift.perHour;
        }
      }
    } catch (err) {
      console.log(err);
    }
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

  public async getStaff() {
    try {
      const staff = await this.fs.getStaff();
      if (staff) {
        staff.subscribe((data: any) => {
          console.log(data);
          this.staffs = data;
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

// Calculate time hours for shift
  public async timeDifference() {
    const dateStart = new Date(this.startDate);
    const dateEnd = new Date(this.endDate);
    const startDateDay = dateStart.getDate();
    const endDateDay = dateEnd.getDate();
    // check if shift starts and ends on the same day
    if (startDateDay === endDateDay) {
      this.checkHoliday(dateStart);
      let diff = (dateStart.getTime() - dateEnd.getTime()) / 1000;
      diff /= (60 * 60);
      this.hours = [Math.abs(Math.round(diff * 10) / 10), 0];
    } else {
      this.checkHoliday(dateStart, dateEnd);
      const endofStartDate = new Date(endOfDay(dateStart));
      const startofEndDate = new Date(startOfDay(dateEnd));
      let diff1 = (dateStart.getTime() - endofStartDate.getTime()) / 1000;
      diff1 /= (60 * 60);
      let diff2 = (startofEndDate.getTime() - dateEnd.getTime()) / 1000;
      diff2 /= (60 * 60);
      this.hours = [Math.abs(Math.round(diff1 * 10) / 10), Math.abs(Math.round(diff2 * 10) / 10)];
      // const hourOne = Number(Math.round((diff1 * 4) / 4).toFixed(2));
      // const hourTwo = Number(Math.round((diff2 * 4) / 4).toFixed(2));
      // this.hours = [Math.abs(hourOne), Math.abs(hourTwo)];
    }
  }

  public async checkHoliday(dateStart: any, dateEnd?: any) {
    try {
      console.log(dateStart);
      // console.log(dateEnd);
      // console.log(dateStart.getTime());
      const holidays = await this.fs.getHolidays();
      if (holidays) {
        holidays.subscribe((data: any) => {
          // console.log(data);
          data.forEach((holiday: any) => {
            const date = holiday.date.toDate();
            // console.log(date);
            const startPay = this.sameDayCheck(dateStart, date);
            let endPay: number;
            if (dateEnd) {
              endPay = this.sameDayCheck(dateEnd, date);
            }
            if (startPay === 1.5) {
              this.pay1 = 1.5;
            }
            if (endPay === 1.5) {
              this.pay2 = 1.5;
            }
            // console.log(this.pay1);
            // console.log(this.pay2);
          });
          if (this.shift && !this.duplicate) {
            this.updateShift();
          } else if (this.shift && this.duplicate) {
            this.duplicateShift();
          } else {
            this.addShift();
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  public sameDayCheck(firstDay, secondDay) {
    // console.log(firstDay);
    // console.log(secondDay);
    if (firstDay.getFullYear() === secondDay.getFullYear() &&
        firstDay.getMonth() === secondDay.getMonth() &&
        firstDay.getDate() === secondDay.getDate()) {
          return 1.5;
        } else {
          return 1;
        }
  }

  public createShift() {
    let message: string;
    if (!this.clientChosen) {
      message = 'Please chose a client';
      this.presentToast(message);
    } else if (!this.jobType) {
      message = 'Please chose a Job Type';
      this.presentToast(message);
    } else if (this.staffChosen && !this.pay) {
      message = 'Please Add Pay Per Hour';
      this.presentToast(message);
    } else if (!this.startDate) {
      message = 'Please chose a Start Date';
      this.presentToast(message);
    } else if (!this.endDate) {
      message = 'Please chose an End Date';
      this.presentToast(message);
    } else {
      console.log(this.staffChosen);
      console.log(this.endDate);
      const hours = this.timeDifference();
      console.log(hours);
    }
  }

  public async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  public async duplicateShift() {
    if (!this.created) {
      this.created = true;
      let shift: any;
      if (!this.startDate.seconds) {
        this.startDate = new Date(this.startDate);
        this.endDate = new Date(this.endDate);
      }
      console.log(this.startDate);
      if (this.staffChosen) {
        console.log(this.staffChosen);
        shift = {
          address: this.clientChosen.address,
          assigned: true,
          break: this.break / 60,
          client: this.clientChosen.client,
          dateStartTime: this.startDate,
          dateEndTime: this.endDate,
          hours: this.hours,
          jobTitle: this.jobType,
          assignedTo: this.staffChosen,
          perHour: this.pay,
          pay: this.pay1 * (this.pay * (this.hours[0] - (this.break / 60))) + (this.pay2 * (this.pay * this.hours[1])),
          payMultiplier: [this.pay1, this.pay2],
          shiftInfo: this.shiftInfo,
          completed: false,
          clockedIn: false,
        };
      } else {
        shift = {
          address: this.clientChosen.address,
          assigned: false,
          break: this.break / 60,
          client: this.clientChosen.client,
          dateStartTime: this.startDate,
          dateEndTime: this.endDate,
          hours: this.hours,
          jobTitle: this.jobType,
          payMultiplier: [this.pay1, this.pay2],
          shiftInfo: this.shiftInfo,
          completed: false,
          clockedIn: false,
        };
      }
      console.log(shift);
      // if (!this.shift.assignedTo) {
      //   if (this.staffChosen) {
      //     // await this.fs.addShiftToStaff(shift, this.shift.id, this.staffChosen.id);
      //     await this.fs.createShift(shift, this.staffChosen);
      //   }
      // } else {
      //   console.log(this.staffChosen);
      //   console.log(this.shift.assignedTo);
      //   if (this.staffChosen.id !== this.shift.assignedTo.id) {
      //     await this.fs.createShift(shift, this.staffChosen);
      //     // await this.fs.addShiftToStaff(shift, this.shift.id, this.staffChosen.id);
      //     await this.fs.removeShiftToStaff(shift, this.shift.id, this.shift.assignedTo.id);
      //   }
      // }
      if (this.staffChosen) {
        if (this.staffChosen.id !== this.shift.assignedTo.id) {
          await this.fs.createShift(shift, this.staffChosen);
        } else {
          await this.fs.createShift(shift);
        }
      } else {
        await this.fs.createShift(shift);
      }
      // await this.fs.createShift(shift);
      this.dismiss();
    }
  }

  public async updateShift() {
    let shift: any;
    if (!this.startDate.seconds) {
      this.startDate = new Date(this.startDate);
      this.endDate = new Date(this.endDate);
    }
    console.log(this.startDate);
    if (this.staffChosen) {
      console.log(this.staffChosen);
      shift = {
        address: this.clientChosen.address,
        assigned: true,
        break: this.break / 60,
        client: this.clientChosen.client,
        dateStartTime: this.startDate,
        dateEndTime: this.endDate,
        hours: this.hours,
        jobTitle: this.jobType,
        assignedTo: this.staffChosen,
        perHour: this.pay,
        pay: this.pay1 * (this.pay * (this.hours[0] - (this.break / 60))) + (this.pay2 * (this.pay * this.hours[1])),
        payMultiplier: [this.pay1, this.pay2],
        shiftInfo: this.shiftInfo,
        completed: false,
        clockedIn: false,
      };
    } else {
      shift = {
        address: this.clientChosen.address,
        assigned: false,
        break: this.break / 60,
        client: this.clientChosen.client,
        dateStartTime: new Date(this.startDate),
        dateEndTime: new Date(this.endDate),
        hours: this.hours,
        jobTitle: this.jobType,
        payMultiplier: [this.pay1, this.pay2],
        shiftInfo: this.shiftInfo,
        completed: false,
        clockedIn: false,
      };
    }
    console.log(shift);
    if (this.staffChosen) {
      if (this.shift.assignedTo) {
        if (this.staffChosen.name !== this.shift.assignedTo.name) {
          await this.fs.removeShiftToStaff(shift, this.shift.id, this.shift.assignedTo.id);
          await this.fs.updateShift(shift, this.shift.id, this.staffChosen);
        } else {
          await this.fs.updateShift(shift, this.shift.id, this.staffChosen);
        }
      } else {
        // await this.fs.addShiftToStaff(shift, this.shift.id, this.staffChosen.id);
        await this.fs.updateShift(shift, this.shift.id, this.staffChosen);
      }
    } else {
      await this.fs.updateShift(shift, this.shift.id);
    }
    this.dismiss();
  }

  public async addShift() {
    try {
      if (!this.created) {
        this.created = true;
        let assigned = false;
        if (this.staffChosen) {
          assigned = true;
        }
        if (!this.shiftInfo) {
          this.shiftInfo = 'N/A';
        }
        let shift: any;
        if (this.staffChosen) {
          console.log(this.staffChosen);
          shift = {
            address: this.clientChosen.address,
            assigned,
            break: this.break / 60,
            client: this.clientChosen.client,
            dateStartTime: new Date(this.startDate),
            dateEndTime: new Date(this.endDate),
            hours: this.hours,
            jobTitle: this.jobType,
            assignedTo: this.staffChosen,
            perHour: this.pay,
            pay: this.pay1 * (this.pay * (this.hours[0] - (this.break / 60))) + (this.pay2 * (this.pay * this.hours[1])),
            payMultiplier: [this.pay1, this.pay2],
            shiftInfo: this.shiftInfo,
            completed: false,
            clockedIn: false,
          };
          console.log(shift);
        } else {
          shift = {
            address: this.clientChosen.address,
            assigned,
            break: this.break / 60,
            client: this.clientChosen.client,
            dateStartTime: new Date(this.startDate),
            dateEndTime: new Date(this.endDate),
            hours: this.hours,
            jobTitle: this.jobType,
            payMultiplier: [this.pay1, this.pay2],
            shiftInfo: this.shiftInfo,
            completed: false,
            clockedIn: false,
          };
          console.log(shift);
        }
        // if (this.staffChosen) {
        //   await this.fs.addShiftToStaff(shift, this.staffChosen.id);
        // }
        await this.fs.createShift(shift, this.staffChosen);
        this.dismiss();
      }
    } catch (err) {
      console.log(err);
    }
  }

}
