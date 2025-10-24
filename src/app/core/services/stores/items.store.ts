import { Injectable, signal, computed, inject, OnDestroy } from '@angular/core';
import { Subject, takeUntil, tap, catchError, of } from 'rxjs';
import { ItemsService } from '../items/items.service';
import { LoadingService } from '../loading.service';
import { Item } from '../../models/item.model';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
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
  readonly isGlobalLoading = computed(() => this.loadingService.isLoadingKey(this.ITEMS_LOADING_KEY));

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItems(): void {
    this._loading.set(true);
    this._error.set(null);
    
    this.loadingService.setLoading(this.ITEMS_LOADING_KEY, 'Loading items from server...');
    
    this.itemsService.getItems().pipe(
      takeUntil(this.destroy$),
      tap(items => {
        this._items.set(items);
        this._loading.set(false);
        this._lastUpdated.set(new Date());
        this.loadingService.clearLoading(this.ITEMS_LOADING_KEY);
      }),
      catchError(error => {
        const errorMessage = error?.error?.message || 'Failed to load items. Please try again.';
        this.notificationService.showError(errorMessage);
        this._error.set(errorMessage);
        this._loading.set(false);
        this.loadingService.clearLoading(this.ITEMS_LOADING_KEY);
        return of([]);
      })
    ).subscribe();
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

  getItemById(id: number): Item | undefined {
    return this._items().find(item => item.id === id);
  }
  
  getItemsByName(name: string): Item[] {
    return this._items().filter(item => 
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  
  getItemsCount(): number {
    return this._items().length;
  }
}