import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DemandeCartes {
  email: string;
  cin: string;
  rib: string;
  cardType: string;
  action: string;
  statut: string;
  docId?: string; // Added property for document ID
  uid: string
}

@Component({
  selector: 'app-demande-carte',
  templateUrl: './demande-carte.component.html',
  styleUrls: ['./demande-carte.component.css']
})
export class DemandeCarteComponent implements OnInit {
  demandeCartesCollection: AngularFirestoreCollection<DemandeCartes>;
  demandeCartes: Observable<DemandeCartes[]> | undefined; // Initialize as undefined
  dataSource: MatTableDataSource<DemandeCartes>;
  displayedColumns: string[] = ['email', 'cin', 'rib', 'cardType', 'action', 'statut'];

  constructor(private fs: AngularFirestore, private snackBar: MatSnackBar) {
    this.demandeCartesCollection = this.fs.collection<DemandeCartes>('DemandeCartes');
    this.dataSource = new MatTableDataSource<DemandeCartes>();
  }

  ngOnInit(): void {
    this.fetchDemandeCartesData();
  }

  fetchDemandeCartesData(): void {
    this.demandeCartes = this.demandeCartesCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as DemandeCartes;
          const docId = a.payload.doc.id;
          return { docId, ...data };
        })
      )
    );
    this.demandeCartes.subscribe((data: DemandeCartes[]) => {
      this.dataSource.data = data;
    });
  }
  

  refuserDemande(demande: DemandeCartes): void {
    demande.statut = 'Demande refusée';
    this.updateDemande(demande);
    this.snackBar.open('Demande de carte refusée', 'Fermer', { duration: 3000 });
  }

  accepterDemande(demande: DemandeCartes): void {
    demande.statut = 'Demande acceptée';
    this.updateDemande(demande);
    this.snackBar.open('Demande de carte acceptée', 'Fermer', { duration: 3000 });

  }

 

  private updateDemande(demande: DemandeCartes): void {
    // Mettez à jour la demande dans la base de données
    const { docId, ...updatedDemande } = demande;
    this.demandeCartesCollection.doc(docId).update(updatedDemande);
  }
}
