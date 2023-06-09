import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild, ElementRef } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { MessagingService } from 'src/app/service/messaging.service';


interface User {
  nom: string;
  email: string;
  accountType: string;
  uid: string;
  flName: string;
  rib: string;
  isActive: boolean; // Nouveau champ pour indiquer l'état du compte
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('addAccountModalRef') addAccountModalRef!: ElementRef;

  usersCollection!: AngularFirestoreCollection<User>;
  users!: Observable<User[]>;
  displayedColumns: string[] = ['flName', 'email', 'accountType', 'rib', 'isActive', 'actions'];
  showRegistrationForm: boolean = false;
  accountActivated: boolean = false;

  constructor(
    private sa: AuthService,
    private router: Router,
    private fs: AngularFirestore,
    private firestore: AngularFirestore,
    private snackBar: MatSnackBar,
    private angularFireMessaging: AngularFireMessaging, // Inject AngularFireMessaging
    private messagingService: MessagingService
  ) {}

  ngOnInit(): void {
    this.usersCollection = this.firestore.collection<User>('users');
    this.users = this.usersCollection.valueChanges().pipe(
      catchError((error) => {
        console.error('Error retrieving users:', error);
        return throwError(error);
      })
    );

    this.messagingService.requestPermission();

    // Receive messages when the app is in the foreground
    this.messagingService.receiveMessage();
  }
    
  


  
    
  closeRegistrationForm() {
    this.showRegistrationForm = false;
  }

  activateAccount(user: User): void {
    this.usersCollection.doc(user.uid).update({ isActive: true })
      .then(() => {
        this.accountActivated = true;
        
        // Send notification to the user
        const notification: any = {
          title: 'Account Activated',
          body: 'Your account has been activated. You can now access all the features.'
        };
        this.messagingService.sendNotification(user.uid, notification);
      })
      .catch((error) => {
        console.error('Error activating account:', error);
      });
      this.snackBar.open('Compte activé', 'Fermer', { duration: 3000 });

  }
  
  deactivateAccount(user: User): void {
    this.usersCollection.doc(user.uid).update({ isActive: false })
      .then(() => {
        this.accountActivated = false;
      })
      .catch((error) => {
        console.error('Error deactivating account:', error);
      });
      this.snackBar.open('Compte désactivé', 'Fermer', { duration: 3000 });

  }
  
  
  openRegistrationForm(): void {
    this.showRegistrationForm = true;
  }

  generateRandomRib(): string {
    const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `1000403451419027${randomDigits}`;
  }
  

  register(f: any) {
    let data = f.value;
    this.sa
      .signUp(data.email, data.password)
      .then((user) => {
        localStorage.setItem("userConnect", user.user?.uid ?? "");
        const rib = this.generateRandomRib(); // Générez le numéro de RIB
        
        this.fs
        .collection("users")
        .doc(user.user?.uid ?? "")
        .set({
          flName: data.flName,
          email: data.email,
          telephone: data.telephone,
          adresse: data.adresse,
          accountType: data.accountType,
          image: "https://previews.123rf.com/images/salamatik/salamatik1801/salamatik180100019/92979836-ic%C3%B4ne-de-visage-anonyme-de-profil-personne-silhouette-grise-avatar-par-d%C3%A9faut-masculin-photo.jpg",
          demande: "",
          rib: rib,
          cin: data.cin,
          uid: user.user?.uid ?? "",
          isActive: false // Définir le compte comme désactivé
        })
          .then(() => {
            this.addAccountModalRef.nativeElement.classList.remove('show'); // Fermer le modal en enlevant la classe 'show'
            this.addAccountModalRef.nativeElement.setAttribute('aria-modal', 'false'); // Modifier l'attribut aria-modal à 'false'
            this.addAccountModalRef.nativeElement.style.display = 'none'; // Masquer le modal en changeant le style à 'none'
      
            this.snackBar.open('Compte créé avec succès', 'Fermer', {
              duration: 3000, // Afficher le snackbar pendant 3 secondes
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop && modalBackdrop.parentNode) { // Vérifier que modalBackdrop et parentNode ne sont pas null
              modalBackdrop.parentNode.removeChild(modalBackdrop);
            }
          });
        
      })
      .catch(() => {
        console.log("error !");
      });
  }
}
