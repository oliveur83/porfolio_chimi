import { Component, ElementRef, Inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { logo } from '../logo2';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css',
})
export class PrincipalComponent {
  title = 'maryne_porr';
  private threeJSUtils!: logo;

  constructor(
    @Inject(ElementRef) private elementRef: ElementRef,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    const container = this.elementRef.nativeElement.querySelector('#container');

    if (container) {
      this.threeJSUtils = new logo(container);

      // 1. Petit délai de 50ms pour laisser le DOM et Vercel stabiliser la taille du conteneur
      setTimeout(() => {
        this.threeJSUtils.init();
      }, 50);
    }
  }

  // 2. Écoute le redimensionnement de la fenêtre pour ajuster le canvas
  @HostListener('window:resize')
  onResize() {
    if (
      this.threeJSUtils &&
      typeof (this.threeJSUtils as any).onWindowResize === 'function'
    ) {
      (this.threeJSUtils as any).onWindowResize();
    }
  }
}
