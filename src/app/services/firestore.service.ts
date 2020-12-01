import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface IUser {
  userId: string;
  name: string;
  manager: boolean;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  public signedIn: Observable<any>;
  public usersRef: AngularFirestoreCollection<IUser> = null;
  public userDoc: AngularFirestoreDocument<any>;
  public user: Observable<any>;
  public shiftsRef: any;
  public shifts: Observable<any>;
  public clientsRef: any;
  public clients: Observable<any>;

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth) {
    this.signedIn = new Observable((subscriber) => {
        this.auth.onAuthStateChanged(subscriber);
    });
    this.shiftsRef = this.afs.collection('shifts');
    this.shifts = this.shiftsRef.valueChanges({ idField: 'id' });

    this.clientsRef = this.afs.collection('clients');
    this.clients = this.shiftsRef.valueChanges({ idField: 'id' });

    this.usersRef = afs.collection('users');
  }

  public async getUser() {
    try {
      const user = await this.auth.currentUser;
      return user;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public async getShifts() {
    try {
      console.log(this.shifts);
      return this.shifts;
    } catch (err) {
      console.log(err);
    }
  }

  public async getClients() {
    try {
      console.log(this.clients);
      return this.clients;
    } catch (err) {
      console.log(err);
    }
  }

  public async signIn(email: string, password: string) {
      try {
        if (!email || !password) {
          throw new Error('Invalid email and/or password');
        }
        await this.auth.signInWithEmailAndPassword(email, password);
        return true;
      } catch (error) {
          console.log('Sign in failed', error);
          return false;
      }
  }

  public async updateDate(shift: any) {
    // const date = new Date();
    // date.setDate(21);
    // date.setMonth(11);
    // date.setHours(0);
    // date.setFullYear(2020);
    // date.setMinutes(0);
    // date.setSeconds(0);
    // date.setMilliseconds(0);
    // console.log(date);
    // console.log(shift);
    // shift.dateEndTime = date;
    // this.afs.doc('shifts/' + shift.id).update(shift);
  }

  public async signout() {
    try {
      const result = await this.auth.signOut();
      console.log(result);
      return true;
    } catch (error) {
      console.log('Sign out failed', error);
      return false;
    }
  }

  public async checkAdmin() {
    try {
      const user = await this.auth.currentUser;
      console.log(user);
      return this.afs.collection('users', (ref) => ref.where('userId', '==', user.uid).limit(1)).snapshotChanges().pipe(
        map((actions) => actions.map((a) => a.payload.doc.data())),
      );
    } catch (err) {
      console.log(err);
    }
  }

  public async createUserDoc(name: string) {
    console.log('create user');
    const user = await this.auth.currentUser;
    console.log(user);
    try {
      const userRef = this.afs.collection('users', (ref) => ref.where('userId', '==', user.uid).limit(1)).snapshotChanges().pipe(
        map((actions) => actions.map((a) => a.payload.doc.data())),
      );
      let userQuery: any;
      console.log(userRef);
      userRef.subscribe((res: any) => {
        console.log(res[0]);
        userQuery = res[0];
        if (userQuery) {
          console.log('Document data: ', userQuery);
        } else {
          console.log('Creating new user with id ' + user.uid);
          const id = this.afs.createId();
          const userInfo = {
            userId: user.uid,
            name,
            email: user.email,
            manager: false,
          };
          this.usersRef.doc(id).set(userInfo);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async signup(email: string, password: string, name: string) {
    try {
      const user = await this.auth.createUserWithEmailAndPassword(email, password);
      // await this.createUserDoc(name, email, user);
      return user;
    } catch (error) {
      console.log('signup failed', error);
      return false;
    }
  }

  public async updateUserName(name: string) {
    try {
      const user = await this.auth.currentUser;
      user.updateProfile({
        displayName: name,
      });
      await this.createUserDoc(name);
      return true;
    } catch (error) {
      console.log('update failed', error);
      return false;
    }
  }
}
