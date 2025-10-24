import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ItemsStore } from '../../../core/services/stores/items.store';
import { ItemsListComponent } from './item-list.component';

describe('ItemsListComponent', () => {
  let component: ItemsListComponent;
  let fixture: ComponentFixture<ItemsListComponent>;

  beforeEach(async () => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['isLoadingKey']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showError']);
    const itemsStoreSpy = jasmine.createSpyObj(
      'ItemsStore',
      ['loadItems', 'refreshItems', 'retry', 'clearError'],
      {
        hasItems: jasmine.createSpy().and.returnValue(false),
        loading: jasmine.createSpy().and.returnValue(false),
        error: jasmine.createSpy().and.returnValue(null),
        lastUpdated: jasmine.createSpy().and.returnValue(null),
        items: jasmine.createSpy().and.returnValue([]),
        totalItems: jasmine.createSpy().and.returnValue(0),
        isEmpty: jasmine.createSpy().and.returnValue(true),
        hasError: jasmine.createSpy().and.returnValue(false),
        isReady: jasmine.createSpy().and.returnValue(true),
      }
    );

    cookieServiceSpy.get.and.returnValue('');
    loadingServiceSpy.isLoadingKey.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        ItemsListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ItemsStore, useValue: itemsStoreSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
