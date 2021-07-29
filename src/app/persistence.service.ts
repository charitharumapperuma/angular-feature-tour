import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private static readonly STORAGE_KEY: string = 'store_key';

  private data: string[];

  constructor() {
    this.loadDataFromStorage();
  }

  public save(id: string): void {
    if (!id) {
      return;
    }
    this.data.push(id);
    localStorage.setItem(PersistenceService.STORAGE_KEY, JSON.stringify(this.data));
  }

  public isCompleted(id: string): boolean {
    return this.data.indexOf(id) > -1;
  }

  private loadDataFromStorage(): void {
    const currentVal = localStorage.getItem(PersistenceService.STORAGE_KEY);
    this.data = currentVal ? JSON.parse(currentVal) : [];
  }
}
