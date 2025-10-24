import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, SharedModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
})
export class LoginComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  protected readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  hidePassword = true;
  errorMessage = '';

  readonly loginForm = this.fb.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]],
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';

      this.authService
        .login(this.loginForm.value as any)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
