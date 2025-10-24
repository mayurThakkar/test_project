import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLoadingComponent } from './shared/components/loading/global-loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalLoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
}
