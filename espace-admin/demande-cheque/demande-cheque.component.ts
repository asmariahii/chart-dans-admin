import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface User {
  nom: string;
  email: string;
  uid: string;
  demande: string;
  // Ajoutez d'autres champs si nécessaire
}

@Component({
  selector: 'app-demande-cheque',
  templateUrl: './demande-cheque.component.html',
  styleUrls: ['./demande-cheque.component.css']
})
export class DemandeChequeComponent implements OnInit {
  usersCollection!: AngularFirestoreCollection<User>;
  users!: Observable<User[]>;
  displayedColumns: string[] = ['nom', 'email', 'uid', 'demande']; // Ajoutez d'autres noms de colonnes si nécessaire

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.usersCollection = this.firestore.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
  }

  updateDemande(user: User, demande: string): void {
    // Mettez à jour le champ 'demande' de l'utilisateur dans la collection Firestore
    this.usersCollection.doc(user.uid).update({ demande: demande })
      .then(() => console.log('Demande mise à jour avec succès'))
      .catch((error) => console.log('Erreur lors de la mise à jour de la demande:', error));
  }
}
