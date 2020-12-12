import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ClientModalPage } from '../client-modal/client-modal.page';
import { FirestoreService } from '../services/firestore.service';
import { ShiftModalPage } from '../shift-modal/shift-modal.page';
import { StaffModalPage } from '../staff-modal/staff-modal.page';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public userAuth: any;
  public completedShifts = [];
  public assignedShifts = [];
  public unassignedShifts = [];
  public assigned = false;
  public unAssigned = true;
  public completed = false;
  constructor(public fs: FirestoreService, public router: Router, public modalController: ModalController,
              public alrtCtrl: AlertController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      console.log(user);
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public async ngOnInit() {
    try {
      const completedShifts = await this.fs.getCompletedShifts();
      const assignedShifts = await this.fs.getAssignedShifts();
      const unassignedShifts = await this.fs.getUnassignedShifts();
      // if (completedShifts) {
      completedShifts.subscribe((data: any) => {
        console.log(data);
        this.completedShifts = data;
      });
      // }
      // if (assignedShifts) {
      assignedShifts.subscribe((data: any) => {
        console.log(data);
        this.assignedShifts = data;
      });
      // }
      // if (unassignedShifts) {
      unassignedShifts.subscribe((data: any) => {
        console.log(data);
        this.unassignedShifts = data;
      });
      // }
    } catch (err) {
      console.log(err);
    }
  }

  public segmentChanged(ev: any) {
    console.log('Segment changed ', ev);
    console.log('Segment is ', ev.detail.value);
    if (ev.detail.value === 'Assigned') {
      this.assigned = true;
      this.unAssigned = false;
      this.completed = false;
    } else if (ev.detail.value === 'Unassigned') {
      this.unAssigned = true;
      this.completed = false;
      this.assigned = false;
    } else {
      this.completed = true;
      this.assigned = false;
      this.unAssigned = false;
    }
  }

  public async presentModal(page: string, shift?: any, duplicate?: any) {
    let modal: any;
    if (page === 'client') {
      modal = await this.modalController.create({
        component: ClientModalPage,
        cssClass: 'my-custom-class',
      });
    } else if (page === 'shift') {
      modal = await this.modalController.create({
        component: ShiftModalPage,
        cssClass: 'my-custom-class',
        componentProps: {
          shift,
          duplicate,
        },
      });
    } else {
      modal = await this.modalController.create({
        component: StaffModalPage,
        cssClass: 'my-custom-class',
      });
    }
    modal.onDidDismiss().then((data: any) => {
      console.log('data');
      console.log(data);
    });
    return await modal.present();
  }

  public async deleteConfirmation(shift: any) {
    console.log(shift);
    const alert = await this.alrtCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure you want to delete this shift?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteShift(shift, shift.id, shift.assignedTo.id);
            // this.getBoxes();
          },
        },
      ],
    });
    await alert.present();
  }

  public async editShift(shift: any) {
    console.log(shift);
    console.log(shift.payMultiplier);
    this.presentModal('shift', shift, false);
  }

  public async duplicateShift(shift: any) {
    console.log(shift);
    console.log(shift.payMultiplier);
    this.presentModal('shift', shift, true);
  }

  public async deleteShift(shift: any, shiftId: any, userId: any) {
    try {
      console.log(shift);
      console.log(shiftId);
      console.log(userId);
      await this.fs.removeShiftToStaff(shift, shiftId, userId);
      await this.fs.deleteShift(shift);
    } catch (err) {
      console.log(err);
    }
  }

}
