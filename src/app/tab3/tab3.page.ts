import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit, OnDestroy {
  public userAuth: Subscription;
  constructor(public fs: FirestoreService, public router: Router) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (!user) {
        this.router.navigate([ 'signin' ]);
      }
    });
  }

  public ngOnInit() {
  }

  public async signout() {
    try {
      await this.fs.signout();
      await this.router.navigate([ 'signin' ]);
    } catch (error) {
      console.log(error);
    }
  }

  public ngOnDestroy() {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

}
