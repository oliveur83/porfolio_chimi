import { Routes } from '@angular/router';
import { ProfilComponent } from './profil/profil.component';

import { CompetenceComponent } from './competence/competence.component';
import { PrincipalComponent } from './principal/principal.component';
import { ParcoursComponent } from './parcours/parcours.component';
export const routes: Routes = [
   
 { path: '', component: PrincipalComponent }, 
    { path: 'profil', component: ProfilComponent }, 
    { path: 'Home', component: PrincipalComponent }, 
    { path: 'competence', component: CompetenceComponent },
    { path: 'parcours', component: ParcoursComponent },  
];
