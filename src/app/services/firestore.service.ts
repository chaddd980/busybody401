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
  shifts: any;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  public signedIn: Observable<any>;
  public usersRef: any;
  public userDoc: AngularFirestoreDocument<any>;
  public user: Observable<any>;
  public shiftsRef: any;
  public shifts: Observable<any>;
  public completedShiftsRef: any;
  public completedShifts: Observable<any>;
  public assignedShiftsRef: any;
  public assignedShifts: Observable<any>;
  public unassignedShiftsRef: any;
  public unassignedShifts: Observable<any>;
  public clientsRef: any;
  public clients: Observable<any>;
  public staffRef: any;
  public staff: Observable<any>;
  public holidaysRef: any;
  public holidays: Observable<any>;

  constructor(public afs: AngularFirestore, public auth: AngularFireAuth) {
    this.signedIn = new Observable((subscriber) => {
        this.auth.onAuthStateChanged(subscriber);
    });
    this.shiftsRef = this.afs.collection('shifts');
    this.shifts = this.shiftsRef.valueChanges({ idField: 'id' });

    this.completedShiftsRef = this.afs.collection('shifts', (ref) => ref.where('completed', '==', true));
    this.completedShifts = this.completedShiftsRef.valueChanges({ idField: 'id' });

    this.assignedShiftsRef = this.afs.collection('shifts', (ref) => ref.where('assigned', '==', true).where('completed', '==', false));
    this.assignedShifts = this.assignedShiftsRef.valueChanges({ idField: 'id' });

    this.unassignedShiftsRef = this.afs.collection('shifts', (ref) => ref.where('assigned', '==', false));
    this.unassignedShifts = this.unassignedShiftsRef.valueChanges({ idField: 'id' });

    this.clientsRef = this.afs.collection('clients');
    this.clients = this.clientsRef.valueChanges({ idField: 'id' });

    this.staffRef = this.afs.collection('users', (ref) => ref.where('manager', '==', false));
    this.staff = this.staffRef.valueChanges({ idField: 'id' });

    this.holidaysRef = this.afs.collection('holidays');
    this.holidays = this.holidaysRef.valueChanges({ idField: 'id' });

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

  public async getStaffInfo() {
    try {
      const user = await this.auth.currentUser;
      console.log(user);
      const staffInfoRef = this.afs.collection('users', (ref) => ref.where('userId', '==', user.uid));
      const staffInfo = staffInfoRef.valueChanges({ idField: 'id' });
      return staffInfo;
    } catch (err) {
      console.log(err);
    }
  }

  public async getUserShifts(user: any) {
    try {
      console.log(user);
      const shifts = await this.usersRef.doc(user.id).collection('shifts').valueChanges({idField: 'id'});
      console.log(shifts);
      return shifts;
    } catch (err) {
      console.log(err);
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

  public async getCompletedShifts() {
    try {
      console.log(this.completedShifts);
      return this.completedShifts;
    } catch (err) {
      console.log(err);
    }
  }

  public async getAssignedShifts() {
    try {
      console.log(this.assignedShifts);
      return this.assignedShifts;
    } catch (err) {
      console.log(err);
    }
  }

  public async getUnassignedShifts() {
    try {
      console.log(this.unassignedShifts);
      return this.unassignedShifts;
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

  public async getStaff() {
    try {
      console.log(this.staff);
      return this.staff;
    } catch (err) {
      console.log(err);
    }
  }

  public async getHolidays() {
    try {
      console.log(this.holidays);
      return this.holidays;
    } catch (err) {
      console.log(err);
    }
  }

  public async createId() {
    try {
      const id = this.afs.createId();
      return id;
    } catch (err) {
      console.log(err);
    }
  }

  public async createClient(client: any) {
    try {
      await this.clientsRef.doc(client.name).set(client);
    } catch (err) {
      console.log(err);
    }
  }

  public async createShift(shift: any, staffChosen?: any) {
    try {
      const shiftId = this.afs.createId();
      await this.shiftsRef.doc(shiftId).set(shift);
      if (staffChosen) {
        await this.addShiftToStaff(shift, shiftId, staffChosen.id);
      }
    } catch (err) {
      console.log(shift);
      console.log(err);
    }
  }

  // public async addShiftToStaff(shift: any, shiftId: any, userId: string) {
  //   try {
  //     console.log(userId);
  //     await this.usersRef.doc(userId).ref.get().then((doc: any) => {
  //       if (doc.exists) {
  //         console.log('Document data:', doc.data());
  //         const shifts = doc.data().shifts;
  //         shift.id = shiftId;
  //         shifts.push(shift);
  //         console.log(shifts);
  //         this.afs.doc('users/' + userId).update({ shifts });
  //       } else {
  //         console.log('No such document!');
  //       }
  //     }).catch((err: any) => {
  //       console.log('error getting doc', err);
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  public async addShiftToStaff(shift: any, shiftId: any, userId: string) {
    try {
      console.log(userId);
      await this.afs.collection('users/' + userId + '/shifts').doc(shiftId).set(shift)
      .catch((err: any) => {
        console.log(err);
      });
      // await this.afs.collection('users/' + userId + '/shifts').add(shift)
      // await this.usersRef.doc(userId).ref.get().then((doc: any) => {
      //
      // }).catch((err: any) => {
      //   console.log('error getting doc', err);
      // });
    } catch (err) {
      console.log(err);
    }
  }

  public async removeShiftToStaff(shift: any, shiftId: string, userId: string) {
    try {
      console.log(userId);
      await this.usersRef.doc(userId).ref.get().then((doc: any) => {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          console.log(shiftId);
          const shifts = doc.data().shifts;
          // shifts.forEach((element: any) => {
          //   console.log(element);
          //   console.log(shift);
          //   console.log(shiftId);
          //   if (element.id === shiftId) {
          //   }
          // });
          const userShifts = shifts.filter((userShift: any) => userShift.id !== shiftId);
          console.log(userShifts);
          this.usersRef.doc(userId).update({
            shifts: shifts.filter((userShift: any) => userShift.id !== shiftId),
          });
          // this.afs.doc('users/' + id).update({ shifts });
        } else {
          console.log('No such document!');
        }
      }).catch((err: any) => {
        console.log('error getting doc', err);
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async deleteShift(shift: any) {
    try {
      await this.shiftsRef.doc(shift.id).delete().then(() => {
        console.log('document sucesfully deleted');
      });
    } catch (err) {
      console.log(err);
    }
  }

  public async updateShift(shift: any, shiftId: any, staffChosen?: any) {
    try {
      await this.shiftsRef.doc(shiftId).update(shift);
      if (staffChosen) {
        await this.removeShiftToStaff(shift, shiftId, staffChosen.id);
        await this.addShiftToStaff(shift, shiftId, staffChosen.id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async updateShiftInfo(shift: any, shiftId: any, staffChosen?: any) {
    try {
      if (shift.clockedIn) {
        await this.shiftsRef.doc(shiftId).update(shift);
        await this.usersRef.doc(staffChosen.id).collection('shifts').doc(shiftId).update(shift);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // public async getUserShifts(user: any) {
  //   try {
  //     console.log(user);
  //     const shifts = await this.usersRef.doc(user.id).collection('shifts').valueChanges({idField: 'id'});
  //     console.log(shifts);
  //     return shifts;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

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

  public async createUserDoc(name: string, pNumber) {
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
            shifts: [],
            phoneNumber: pNumber,
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

  public async updateUserName(name: string, pNumber: any) {
    try {
      const user = await this.auth.currentUser;
      user.updateProfile({
        displayName: name,
      });
      await this.createUserDoc(name, pNumber);
      return true;
    } catch (error) {
      console.log('update failed', error);
      return false;
    }
  }
}
