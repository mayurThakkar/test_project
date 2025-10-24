import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-app-toolbar',
  imports: [SharedModule],
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss'],
  standalone: true,
})
export class AppToolbarComponent {
  @Input() pageTitle: string = 'Dashboard';
  @Input() pageIcon?: string;
  @Input() showBackButton: boolean = false;
  @Input() showNavLinks: boolean = true;

  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
