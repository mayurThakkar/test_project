import { Injectable, signal, computed } from '@angular/core';

export interface LoadingState {
  key: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _loadingStates = signal<Map<string, LoadingState>>(new Map());
  
  readonly loadingStates = this._loadingStates.asReadonly();
  
  readonly isLoading = computed(() => {
    return this._loadingStates().size > 0;
  });
  
  readonly loadingCount = computed(() => {
    return this._loadingStates().size;
  });
  
  readonly currentLoadingMessages = computed(() => {
    const states = this._loadingStates();
    return Array.from(states.values()).map(state => state.message || 'Loading...');
  });
  
  readonly primaryLoadingMessage = computed(() => {
    const messages = this.currentLoadingMessages();
    return messages[0] || 'Loading...';
  });

  setLoading(key: string, message?: string): void {
    this._loadingStates.update(states => {
      const newStates = new Map(states);
      newStates.set(key, { key, message });
      return newStates;
    });
  }
  
  clearLoading(key: string): void {
    this._loadingStates.update(states => {
      const newStates = new Map(states);
      newStates.delete(key);
      return newStates;
    });
  }
  
  clearAllLoading(): void {
    this._loadingStates.set(new Map());
  }
  
  isLoadingKey(key: string): boolean {
    return this._loadingStates().has(key);
  }
  
  getLoadingMessage(key: string): string | undefined {
    return this._loadingStates().get(key)?.message;
  }
}