import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface User {
  f1Name: string;
  rib: string;
  dateExpiration: string;
  uid: string;
  cin: string;
  approved: boolean;
  statut: string;
  cardType: string; // Add the cardType property
}



@Component({
  selector: 'app-demande-carte',
  templateUrl: './demande-carte.component.html',
  styleUrls: ['./demande-carte.component.css']
})
export class DemandeCarteComponent implements OnInit {
  demandesCollection!: AngularFirestoreCollection<User>;
  demandes!: Observable<User[]>;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.demandesCollection = this.firestore.collection<User>('users');
    this.demandes = this.demandesCollection.valueChanges();
  }

  approveDemande(demande: User) {
    this.firestore.collection('users').doc(demande.uid).update({ approved: true });
    this.firestore.collection('users').doc(demande.uid).update({ statut: 'approved' });
  }

  
  rejectDemande(demande: User) {
    // Implement the logic to reject the card request
    // For example, update the status of the request in the database
    this.firestore.collection('users').doc(demande.uid).update({ statut: 'rejected' });
  }

  
}
