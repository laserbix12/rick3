import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CharacterService, Character } from '../../core/services/character.service';
import { CharacterCardComponent } from '../../components/character-card/character-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CharacterCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private characterService = inject(CharacterService);
  private platformId = inject(PLATFORM_ID);
  
  characters = signal<Character[]>([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Iniciando fetching de datos en Home...');
      this.characterService.getCharacters().subscribe({
        next: (response) => {
          this.characters.set(response.results);
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        }
      });
    }
  }
}
