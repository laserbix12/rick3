import { Component, input, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../core/services/character.service';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './character-card.scss',
})
export class CharacterCardComponent {
  character = input.required<Character>();
  private favoritesService = inject(FavoritesService);

  isFavorite = computed(() => this.favoritesService.favorites().some(f => f.id === this.character().id));

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.character());
  }
}
