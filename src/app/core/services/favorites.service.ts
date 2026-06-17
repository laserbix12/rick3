import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Character } from './character.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private platformId = inject(PLATFORM_ID);
  private favoritesSignal = signal<Character[]>(this.loadFavorites());

  public favorites = computed(() => this.favoritesSignal());

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('favorites', JSON.stringify(this.favoritesSignal()));
      }
    });
  }

  private loadFavorites(): Character[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const stored = localStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  toggleFavorite(character: Character) {
    this.favoritesSignal.update(favs => {
      const index = favs.findIndex(f => f.id === character.id);
      if (index > -1) {
        return favs.filter(f => f.id !== character.id);
      } else {
        return [...favs, character];
      }
    });
  }

  isFavorite(id: number): boolean {
    return this.favoritesSignal().some(f => f.id === id);
  }
}
