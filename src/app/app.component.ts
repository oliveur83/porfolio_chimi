import { Component,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { logo } from './logo';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'maryne_por';
  constructor( private elementRef: ElementRef, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  
  ngAfterViewInit() {
    const container = this.elementRef.nativeElement.querySelector('#container');

    const threeJSUtils = new logo(container);
    threeJSUtils.init();
    console.log("toto")
  }
  profil(){
    
    this.router.navigate(['/profil']);
    
  }
}
