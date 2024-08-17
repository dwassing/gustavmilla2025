import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePage } from "./home/home.page";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomePage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'webapp';
}
