import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  public userAuth: Subscription;
  public admin: false;
  constructor(public fs: FirestoreService,
              public router: Router,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (!user) {
        this.router.navigate([ 'signin' ]);
      } else {
        console.log(user);
        this.checkAdmin();
      }
    });
  }

  public ngOnInit() {
    // const isManager = this.fs.checkAdmin();
    // console.log(isManager);
  }

  public async checkAdmin() {
    try {
      // const isManager = await this.fs.checkAdmin();
      // isManager.subscribe((res) => {
      //   console.log(res[0]);
      //   console.log(res[0].manager);
      //   this.admin = res[0].manager;
      // });
      // const user = await this.fs.getUser();
      // console.log(user);
      // console.log(user.uid);
      // console.log(user.displayName);
      // console.log(user.email);
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
