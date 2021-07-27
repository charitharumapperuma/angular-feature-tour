import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private static readonly STORAGE_KEY: string = 'store_key';

  public save(id: string): void {
    const currentVal = localStorage.getItem(PersistenceService.STORAGE_KEY);
    const currentValArr: string[] = currentVal ? JSON.parse(currentVal) : [];
    currentValArr.push(id);
    localStorage.setItem(PersistenceService.STORAGE_KEY, JSON.stringify(currentValArr));
  }
}
