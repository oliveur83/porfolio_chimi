import { Component } from '@angular/core';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
 // Définition des textes dans différentes langues
 presentation = {
  francais: "Bonjour à tous, Je suis Bruyère Maryne, actuellement étudiant à l'Université d'Oslo dans le domaine de la chimie.",
  anglais: "Hello everyone, I am Bruyère Maryne, currently a student at the University of Oslo in the field of chemistry.",
  norvegien: "Hei alle sammen, Jeg heter Bruyère Maryne, for tiden student ved Universitetet i Oslo innen kjemi."
};

// URL de votre photo de profil
photoUrl = "../../assets/profil.jpg";
}
