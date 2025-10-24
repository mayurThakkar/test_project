import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['isLoadingKey']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    cookieServiceSpy.get.and.returnValue('');
    loadingServiceSpy.isLoadingKey.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
