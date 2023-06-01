import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

interface User {
  f1Name: string;
  rib: string;
  dateExpiration: string;
  uid: string;
  cin: string;
  cardType: string; // Add the cardType property

}

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent {
  demande: User = {
    f1Name: '',
    rib: '',
    dateExpiration: '',
    uid: '',
    cin: '',
    cardType: '', // Add the cardType property

  };

  ribMatch = true; // Propriété pour indiquer si le RIB correspond
  cinMatch = true; // Propriété pour indiquer si le CIN correspond


  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  async onSubmit(form: NgForm) {
    const uid = await this.authService.getUID();
    this.demande.uid = uid;

    try {
      // Fetch the user from the "users" collection
      const userRef = this.firestore.collection('users').doc(uid);
      const userDoc = await userRef.get().toPromise();

      if (userDoc && userDoc.exists) {
        const userData = userDoc.data() as User;
        
        if (userData.rib === this.demande.rib && userData.cin === this.demande.cin) {
          // RIB and CIN match, proceed with the submission
          await userRef.set(this.demande, { merge: true });
          console.log('Demande de carte enregistrée avec succès.');
          this.router.navigate(['/home']);
        } else {
          this.ribMatch = false; // Le RIB ne correspond pas
          this.cinMatch = false; // Le CIN ne correspond pas
        }
      } else {
        console.error("Utilisateur introuvable.");
        // Handle the error or display a message to the user
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la demande de carte :", error);
    }
  }
}
