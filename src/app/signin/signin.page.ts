import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  public signinForm: FormGroup;
  public userAuth: Subscription;
  public submitAttempt = false;

  constructor(public fs: FirestoreService, public formBuilder: FormBuilder, public router: Router) {
    this.signinForm = formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
    });
    this.userAuth = this.fs.signedIn.subscribe((user) => {
      if (user) {
        this.router.navigate([ 'app/tabs/tab1' ]);
      }
    });
  }

  public ngOnInit() {
  }

  public ngOnDestroy() {
    if (this.userAuth) {
      this.userAuth.unsubscribe();
    }
  }

  public async login() {
    try {
      this.submitAttempt = false;
      if (!this.signinForm.valid) {
        throw new Error('Invalid sign in attempt');
      }
      const user = await this.fs.signIn(this.signinForm.value.email, this.signinForm.value.password);
      if (user) {
        console.log(user);
        const isManager = await this.fs.checkAdmin();
        isManager.subscribe((res: any) => {
          console.log(res[0]);
          console.log(res[0].manager);
          let succeeded: any;
          if (res[0].manager) {
            succeeded = this.router.navigate([ 'app/tabs/tab4' ]);
          } else {
            succeeded = this.router.navigate([ 'app/tabs/tab1' ]);
          }
          if (!succeeded) {
            this.login();
          }
        });
      } else {
        throw new Error('Signin failed');
      }
    } catch (error) {
      console.log(error);
      this.submitAttempt = true;
    }
  }

  public register() {
    this.router.navigate([ '/signup' ]);
  }

}
