import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent {
  title = 'laboratorio-angular';
}

//https://v17.angular.io/guide/router#child-route-components
//https://v17.angular.io/guide/lazy-loading-ngmodules