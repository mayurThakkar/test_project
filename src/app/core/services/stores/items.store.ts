import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { Item } from '../../models/item.model';
import { ItemsService } from '../items/items.service';
import { LoadingService } from '../loading.service';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root',
})
export class ItemsStore implements OnDestroy {
  private readonly itemsService = inject(ItemsService);
  private readonly loadingService = inject(LoadingService);
  private readonly notificationService = inject(NotificationService);

  private readonly destroy$ = new Subject<void>();

  private readonly _items = signal<Item[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _lastUpdated = signal<Date | null>(null);

  private readonly ITEMS_LOADING_KEY = 'items-operation';

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastUpdated = this._lastUpdated.asReadonly();

  readonly totalItems = computed(() => this._items().length);
  readonly hasItems = computed(() => this._items().length > 0);
  readonly isEmpty = computed(() => this._items().length === 0 && !this._loading());
  readonly hasError = computed(() => !!this._error());
  readonly isReady = computed(() => !this._loading() && !this._error());
  readonly isGlobalLoading = computed(() =>
    this.loadingService.isLoadingKey(this.ITEMS_LOADING_KEY)
  );

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItems(): void {
    this._loading.set(true);
    this._error.set(null);

    this.loadingService.setLoading(this.ITEMS_LOADING_KEY, 'Loading items from server...');

    this.itemsService
      .getItems()
      .pipe(
        takeUntil(this.destroy$),
        tap((items) => {
          this._items.set(items);
          this._loading.set(false);
          this._lastUpdated.set(new Date());
          this.loadingService.clearLoading(this.ITEMS_LOADING_KEY);
        }),
        catchError((error) => {
          const errorMessage = error?.error?.message || 'Failed to load items. Please try again.';
          this.notificationService.showError(errorMessage);
          this._error.set(errorMessage);
          this._loading.set(false);
          this.loadingService.clearLoading(this.ITEMS_LOADING_KEY);
          return of([]);
        })
      )
      .subscribe();
  }

  refreshItems(): void {
    this.loadingService.setLoading(this.ITEMS_LOADING_KEY, 'Refreshing items...');
    this.loadItems();
  }

  clearError(): void {
    this._error.set(null);
  }

  retry(): void {
    this.clearError();
    this.loadItems();
  }

  addMockItem(): void {
    const currentItems = this._items();
    const newId = Math.max(...currentItems.map((item) => item.id), 0) + 1;

    const mockItems = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
      },
      { name: 'Gaming Mouse', description: 'Ergonomic gaming mouse with RGB lighting' },
      {
        name: 'Mechanical Keyboard',
        description: 'Premium mechanical keyboard with blue switches',
      },
      { name: 'USB-C Hub', description: 'Multi-port USB-C hub with HDMI and Ethernet' },
      { name: 'Phone Stand', description: 'Adjustable phone stand for desk use' },
      { name: 'Bluetooth Speaker', description: 'Portable Bluetooth speaker with bass boost' },
      { name: 'Webcam HD', description: '1080p HD webcam for video conferencing' },
      { name: 'Power Bank', description: '20000mAh portable power bank with fast charging' },
      { name: 'Laptop Bag', description: 'Waterproof laptop bag with multiple compartments' },
      { name: 'Monitor Stand', description: 'Adjustable monitor stand with storage' },
    ];

    const randomMockItem = mockItems[Math.floor(Math.random() * mockItems.length)];

    const newItem: Item = {
      id: newId,
      name: randomMockItem.name,
      description: randomMockItem.description,
    };

    this._items.set([...currentItems, newItem]);
    this._lastUpdated.set(new Date());
    this.notificationService.showSuccess(`Added "${newItem.name}" successfully!`);
  }

  getItemById(id: number): Item | undefined {
    return this._items().find((item) => item.id === id);
  }

  getItemsByName(name: string): Item[] {
    return this._items().filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
  }

  getItemsCount(): number {
    return this._items().length;
  }
}
