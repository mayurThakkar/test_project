import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ItemsStore } from '../../../core/services/stores/items.store';
import { AppToolbarComponent } from '../../../shared/components/app-toolbar/app-toolbar.component';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [DatePipe, SharedModule, AppToolbarComponent],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
  protected readonly itemsStore = inject(ItemsStore);

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
}
