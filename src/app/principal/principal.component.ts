
import { Component,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { logo } from '../logo';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {
  title = 'maryne_porr';
  constructor( private elementRef: ElementRef, private router: Router, private activatedRoute: ActivatedRoute) {

  }
  
  ngAfterViewInit() {
    const container = this.elementRef.nativeElement.querySelector('#container');

    const threeJSUtils = new logo(container);
    threeJSUtils.init();
  
  }
}

