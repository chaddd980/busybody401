import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
})
export class Tab7Page implements OnInit {

  constructor(public fs: FirestoreService, public router: Router) {
    this.signout();
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

}
