import { Component,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { logo } from './logo';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'maryne_por';
  constructor( private elementRef: ElementRef) {
  
  }
  
  ngAfterViewInit() {
    const container = this.elementRef.nativeElement.querySelector('#container');

    const threeJSUtils = new logo(container);
    threeJSUtils.init();
    console.log("toto")
  }
}
