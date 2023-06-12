import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import Chart from 'chart.js/auto';

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
  filterValue: string = '';


  displayedColumns: string[] = ['email', 'nombreChequier',  'cin', 'action', 'statut'];

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
        this.createRequestStatusChart(); // Generate the request status chart
      });
    }
  }
 
  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
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

 
  
  createRequestStatusChart() {
    const totalUsers = this.dataSource.data.length; // Total des utilisateurs
    const totalAcceptedRequests = this.dataSource.data.filter(d => d.statut === 'Demande acceptée').length; // Total des demandes acceptées
    const totalRejectedRequests = this.dataSource.data.filter(d => d.statut === 'Demande refusée').length; // Total des demandes refusées
    const totalPendingRequests = totalUsers - totalAcceptedRequests - totalRejectedRequests; // Total des demandes en attente
  
    const chartElement = document.getElementById('userRequestChart') as HTMLCanvasElement;
    const ctx = chartElement.getContext('2d');
  
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Utilisateurs'],
          datasets: [{
            label: 'Utilisateurs avec demande acceptée',
            data: [totalAcceptedRequests],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Utilisateurs avec demande refusée',
            data: [totalRejectedRequests],
            backgroundColor: 'rgba(192, 75, 75, 0.2)',
            borderColor: 'rgba(192, 75, 75, 1)',
            borderWidth: 1
          },
          {
            label: 'Utilisateurs avec demande en attente',
            data: [totalPendingRequests],
            backgroundColor: 'rgba(192, 192, 75, 0.2)',
            borderColor: 'rgba(192, 192, 75, 1)',
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: 'white',
                font: {
                  size: 25
                },
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }
      });
    }
  }
  
      }
    
  

