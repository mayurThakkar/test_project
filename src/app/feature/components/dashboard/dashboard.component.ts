import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppToolbarComponent } from '../../../shared/components/app-toolbar/app-toolbar.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, SharedModule, AppToolbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);
}
