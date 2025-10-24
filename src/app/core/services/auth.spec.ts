import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginRequest, LoginResponse, User } from '../models/login.model';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockUser: User = {
    email: 'test@example.com',
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mock-jwt-token',
    user: mockUser,
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const cookieSpyObj = jasmine.createSpyObj('CookieService', ['get', 'set', 'delete']);
    const loadingSpyObj = jasmine.createSpyObj('LoadingService', [
      'setLoading',
      'clearLoading',
      'isLoadingKey',
    ]);
    const notificationSpyObj = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    cookieSpyObj.get.and.callFake((key: string) => {
      if (key === 'auth_token') return '';
      if (key === 'user_data') return '';
      return '';
    });
    loadingSpyObj.isLoadingKey.and.returnValue(false);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: CookieService, useValue: cookieSpyObj },
        { provide: LoadingService, useValue: loadingSpyObj },
        { provide: NotificationService, useValue: notificationSpyObj },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cookieServiceSpy = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    notificationServiceSpy = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and set user state', (done) => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      cookieServiceSpy.set.and.stub();

      service.login(loginRequest).subscribe({
        next: (response) => {
          expect(response).toEqual(mockLoginResponse);
          expect(service.user()).toEqual(mockUser);

          expect(cookieServiceSpy.set).toHaveBeenCalledWith(
            'auth_token',
            'mock-jwt-token',
            jasmine.objectContaining({
              secure: true,
              sameSite: 'Strict',
              expires: 1,
            })
          );

          expect(cookieServiceSpy.set).toHaveBeenCalledWith(
            'user_data',
            JSON.stringify(mockUser),
            jasmine.objectContaining({
              secure: true,
              sameSite: 'Strict',
              expires: 1,
            })
          );

          expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
          expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith(
            'Login successful! Welcome.'
          );

          expect(loadingServiceSpy.setLoading).toHaveBeenCalledWith(
            'login-operation',
            'Authenticating user...'
          );
          expect(loadingServiceSpy.clearLoading).toHaveBeenCalledWith('login-operation');

          done();
        },
      });

      const req = httpMock.expectOne('/api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockLoginResponse);
    });

    it('should handle login error', (done) => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      service.login(loginRequest).subscribe({
        error: (error) => {
          expect(service.user()).toBeNull();
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Login failed. Please try again.'
          );
          expect(loadingServiceSpy.clearLoading).toHaveBeenCalledWith('login-operation');
          done();
        },
      });

      const req = httpMock.expectOne('/api/login');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should logout and clear user state', () => {
      cookieServiceSpy.get.and.callFake((key: string) => {
        if (key === 'auth_token') return 'existing-token';
        if (key === 'user_data') return JSON.stringify(mockUser);
        return '';
      });

      service.logout();

      expect(service.user()).toBeNull();
      expect(cookieServiceSpy.delete).toHaveBeenCalledWith('auth_token');
      expect(cookieServiceSpy.delete).toHaveBeenCalledWith('user_data');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
