import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ItemsStore } from '../../../core/services/stores/items.store';
import { AppToolbarComponent } from '../../../shared/components/app-toolbar/app-toolbar.component';
import { SharedModule } from '../../../shared/shared.module';

export enum ViewMode {
  Card = 'card',
  Grid = 'grid',
}

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [DatePipe, SharedModule, AppToolbarComponent],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
  protected readonly itemsStore = inject(ItemsStore);
  protected readonly viewMode = signal<ViewMode>(ViewMode.Card);

  protected readonly displayedColumns: string[] = ['id', 'name', 'description'];
  readonly ViewMode = ViewMode;

  ngOnInit(): void {
    if (!this.itemsStore.hasItems() && !this.itemsStore.loading()) {
      this.itemsStore.loadItems();
    }
  }

  refreshItems(): void {
    this.itemsStore.refreshItems();
  }

  retryLoad(): void {
    this.itemsStore.retry();
  }

  addMockItem(): void {
    this.itemsStore.addMockItem();
  }

  toggleViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  isCardView(): boolean {
    return this.viewMode() === ViewMode.Card;
  }

  isGridView(): boolean {
    return this.viewMode() === ViewMode.Grid;
  }
}
