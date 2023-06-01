import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface User {
  f1Name: string;
  rib: string;
  dateExpiration: string;
  uid: string;
  cin: string;
  approved: boolean;
  statut: string;
  cardType: string;
}

@Component({
  selector: 'app-cartes',
  templateUrl: './cartes.component.html',
  styleUrls: ['./cartes.component.css']
})
export class CartesComponent implements OnInit {
  user$: Observable<User | undefined> = of(undefined);

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.user$ = this.auth.user.pipe(
      switchMap((user: any) => {
        if (user) {
          return this.firestore.collection<User>('users').doc<User>(user.uid).valueChanges();
        } else {
          return of(undefined);
        }
      })
    );
  }
}
