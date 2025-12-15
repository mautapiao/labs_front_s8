import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-layout-with-navbar',
  templateUrl: './layout-with-navbar.component.html',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet]
})
export class LayoutWithNavbarComponent {
  // Este componente solo agrupa la navbar con el router-outlet
}