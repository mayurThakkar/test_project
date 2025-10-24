import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get', 'set', 'delete']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', [
      'setLoading',
      'clearLoading',
      'isLoadingKey',
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    cookieServiceSpy.get.and.returnValue('');
    loadingServiceSpy.isLoadingKey.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have AuthService injected', () => {
    expect(component['authService']).toBeTruthy();
  });
});
