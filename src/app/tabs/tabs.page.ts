import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  public userAuth: Subscription;
  public admin = false;
  constructor(public fs: FirestoreService, public router: Router) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (!user) {
        console.log('no user');
        this.router.navigate([ 'signin' ]);
      } else {
        console.log(user);
        this.checkAdmin();
      }
    });
  }

  public async checkAdmin() {
    try {
      const isManager = await this.fs.checkAdmin();
      isManager.subscribe((res: any) => {
        console.log(res[0]);
        console.log(res[0].manager);
        this.admin = res[0].manager;
      });
    } catch (error) {
      console.log(error);
    }
  }

}
