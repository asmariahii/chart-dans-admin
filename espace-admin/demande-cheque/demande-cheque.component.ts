import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DemandeCheque {
  uid: string;
  nombreChequier: number | null;
  email: string;
  rib: string;
  cin: string;
  statut: string;
  action: string;
  docId?: string; // Added property for document ID
}

@Component({
  selector: 'app-demande-cheque',
  templateUrl: './demande-cheque.component.html',
  styleUrls: ['./demande-cheque.component.css']
})
export class DemandeChequeComponent implements OnInit {
  demandeChequeCollection: AngularFirestoreCollection<DemandeCheque> | undefined;
  demandeCheque: any;
  dataSource: MatTableDataSource<DemandeCheque>;

  displayedColumns: string[] = ['email', 'nombreChequier', 'rib', 'cin', 'action', 'statut'];

  constructor(private fs: AngularFirestore, private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<DemandeCheque>([]);
  }

  ngOnInit(): void {
    this.demandeChequeCollection = this.fs.collection<DemandeCheque>('DemandeCheque');
    this.fetchDemandeChequeData();
  }

  fetchDemandeChequeData(): void {
    if (this.demandeChequeCollection) {
      this.demandeCheque = this.demandeChequeCollection.snapshotChanges().pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as DemandeCheque;
            const docId = a.payload.doc.id;
            return { docId, ...data };
          })
        )
      );
      this.demandeCheque.subscribe((data: DemandeCheque[]) => {
        this.dataSource.data = data;
      });
    }
  }

  refuserDemande(demande: DemandeCheque): void {
    demande.statut = 'Demande refusée';
    this.updateDemande(demande);
    this.snackBar.open('Demande de chèque refusée', 'Fermer', { duration: 3000 });
  }

  accepterDemande(demande: DemandeCheque): void {
    demande.statut = 'Demande acceptée';
    this.updateDemande(demande);
    this.snackBar.open('Demande de chèque acceptée', 'Fermer', { duration: 3000 });
  }

  private updateDemande(demande: DemandeCheque): void {
    if (this.demandeChequeCollection && demande.docId) {
      // Mettez à jour la demande dans la base de données
      const { docId, ...updatedDemande } = demande;
      this.demandeChequeCollection.doc(docId).update(updatedDemande);
    }
  }
  
}
