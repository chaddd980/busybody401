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
  public loggedIn = false;
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
        console.log(this.router.url);
        if (res[0].manager) {
          if (this.router.url !== '/app/tabs/tab4' && this.router.url !== '/app/tabs/tab5' && this.router.url !== '/app/tabs/tab6' &&
              this.router.url !== '/app/tabs/tab7') {
            this.router.navigate([ 'app/tabs/tab4' ]);
          }
        } else {
          if (this.router.url !== '/app/tabs/tab2' && this.router.url !== '/app/tabs/tab3') {
            this.router.navigate([ 'app/tabs/tab1' ]);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

}
