import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
  public shifts: any;
  public assigned = false;
  constructor(public fs: FirestoreService, public router: Router, public modalController: ModalController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public async ngOnInit() {
    try {
      const shifts = await this.fs.getShifts();
      if (shifts) {
        shifts.subscribe((data: any) => {
          console.log(data);
          this.shifts = data;
          // this.shifts.forEach((element: any) => {
          //   console.log(element);
          //   this.fs.updateDate(element);
          // });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async getShifts() {
    try {
      this.shifts = await this.fs.getShifts();
      if (this.shifts) {
        console.log(this.shifts);
      } else {
        throw new Error('failed getting shifts');
      }
    } catch (err) {
      console.log(err);
    }
  }

  public segmentChanged(ev: any) {
    console.log('Segment changed ', ev);
    console.log('Segment is ', ev.detail.value);
    if (ev.detail.value === 'Assigned') {
      this.assigned = true;
    } else {
      this.assigned = false;
    }
  }

  public async presentModal(page: string) {
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
      });
    } else {
      modal = await this.modalController.create({
        component: StaffModalPage,
        cssClass: 'my-custom-class',
      });
    }
    return await modal.present();
  }

}
