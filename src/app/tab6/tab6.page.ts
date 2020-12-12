import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
})
export class Tab6Page implements OnInit {
  public userAuth: any;
  public staff: any;

  constructor(public fs: FirestoreService, public router: Router) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      console.log(user);
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public async ngOnInit() {
    try {
      await this.getStaff();
    } catch (err) {
      console.log(err);
    }
  }

  public async getStaff() {
    try {
      const staff = await this.fs.getStaff();
      if (staff) {
        staff.subscribe((data) => {
          console.log(data);
          this.staff = data;
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

}
