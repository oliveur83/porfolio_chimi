import { Routes } from '@angular/router';
import { ProfilComponent } from './profil/profil.component';
import { AppComponent } from './app.component';
export const routes: Routes = [
    { path: 'profil', component: ProfilComponent }, 
    { path: '', component: AppComponent }, 
];
