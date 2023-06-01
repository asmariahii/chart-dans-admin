import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';



interface User {
  nom: string;
  email: string;
  accountType: string;
  uid: string;
  flName: string;
  rib: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  usersCollection!: AngularFirestoreCollection<User>;
  users!: Observable<User[]>;
  displayedColumns: string[] = ['flName', 'email', 'accountType', 'uid', 'rib'];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.usersCollection = this.firestore.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
  }

  updateRib(user: User, newRib: string): void {
    user.rib = newRib;
    this.usersCollection.doc(user.uid).update({ rib: newRib });
  }
}