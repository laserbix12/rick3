import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../core/services/favorites.service';
import { CharacterCardComponent } from '../../components/character-card/character-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './favorites.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './favorites.scss',
})
export class Favorites {
  favoritesService = inject(FavoritesService);
}
