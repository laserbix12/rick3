import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterService, Character } from './core/services/character.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('rick3');
  private characterService = inject(CharacterService);
  private platformId = inject(PLATFORM_ID);

  characters: Character[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Iniciando fetching de datos...');
      this.characterService.getCharacters().subscribe({
        next: (response) => {
          console.log('¡Conexión exitosa! Datos obtenidos:', response);
          this.characters = response.results;
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        }
      });
    } else {
      console.log('Ejecutando en el servidor, omitiendo fetching de datos para evitar timeout.');
    }
  }
}
