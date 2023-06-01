import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EspaceAdminRoutingModule } from './espace-admin-routing.module';
import { EspaceAdminComponent } from './espace-admin.component';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { UsersComponent } from './users/users.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DemandeChequeComponent } from './demande-cheque/demande-cheque.component';
import { DemandeCarteComponent } from './demande-carte/demande-carte.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


@NgModule({
  declarations: [
    EspaceAdminComponent,
    UsersComponent,
    DemandeChequeComponent,
    DemandeCarteComponent,
  ],
  imports: [
    CommonModule,
    EspaceAdminRoutingModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    AngularFirestoreModule,

    
  ]
})
export class EspaceAdminModule { }
