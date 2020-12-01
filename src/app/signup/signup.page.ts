import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;
  public userAuth: Subscription;
  public submitAttempt = false;

  constructor(public fs: FirestoreService, public formBuilder: FormBuilder, public router: Router) {
    this.signupForm = formBuilder.group({
      fname: new FormControl('', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])),
      lname: new FormControl('', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.minLength(8), Validators.required])),
    });
  }

  public ngOnInit() {
  }

  public async save() {
    try {
      this.submitAttempt = true;
      if (!this.signupForm.valid) {
        throw new Error('Invalid sign up attempt');
      }
      const name = this.signupForm.value.fname + ' ' + this.signupForm.value.lname;
      const result = await this.fs.signup(this.signupForm.value.email, this.signupForm.value.password, name);
      if (result) {
        console.log('result is: ', result);
        const user = await this.fs.updateUserName(name);
        if (user) {
          this.router.navigate([ 'app/tabs/tab1' ]);
        }
      } else {
        throw new Error('signup failed');
      }
    } catch (error) {
      console.log(error);
    }
  }

  public signin() {
    this.router.navigate([ '/signin' ]);
  }

}
