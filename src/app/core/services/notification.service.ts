import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export interface NotificationConfig {
  message: string;
  action?: string;
  duration?: number;
  type?: NotificationType;
  panelClass?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  showSuccess(message: string, action: string = 'Close', duration: number = 4000): MatSnackBarRef<SimpleSnackBar> {
    return this.show({
      message,
      action,
      duration,
      type: NotificationType.Success
    });
  }

  showError(message: string, action: string = 'Dismiss', duration: number = 6000): MatSnackBarRef<SimpleSnackBar> {
    return this.show({
      message,
      action,
      duration,
      type: NotificationType.Error
    });
  }

  showWarning(message: string, action: string = 'OK', duration: number = 5000): MatSnackBarRef<SimpleSnackBar> {
    return this.show({
      message,
      action,
      duration,
      type: NotificationType.Warning
    });
  }

  showInfo(message: string, action: string = 'Got it', duration: number = 4000): MatSnackBarRef<SimpleSnackBar> {
    return this.show({
      message,
      action,
      duration,
      type: NotificationType.Info
    });
  }

  show(config: NotificationConfig): MatSnackBarRef<SimpleSnackBar> {
    const snackBarConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration: config.duration || this.defaultConfig.duration,
      panelClass: this.getPanelClasses(config.type || NotificationType.Info, config.panelClass)
    };

    const snackBarRef = this.snackBar.open(
      config.message,
      config.action || 'Close',
      snackBarConfig
    );

    return snackBarRef;
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }

  private getPanelClasses(type: NotificationType, additionalClasses?: string[]): string[] {
    const baseClasses = ['notification-snackbar'];
    
    switch (type) {
      case NotificationType.Success:
        baseClasses.push('success-snackbar');
        break;
      case NotificationType.Error:
        baseClasses.push('error-snackbar');
        break;
      case NotificationType.Warning:
        baseClasses.push('warning-snackbar');
        break;
      case NotificationType.Info:
        baseClasses.push('info-snackbar');
        break;
    }

    if (additionalClasses) {
      baseClasses.push(...additionalClasses);
    }

    return baseClasses;
  }
}