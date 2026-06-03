import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterService, Character } from './core/services/character.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('rick3');
  private characterService = inject(CharacterService);

  ngOnInit(): void {
    console.log('Iniciando fetching de datos...');
    this.characterService.getCharacters().subscribe({
      next: (response) => {
        console.log('¡Conexión exitosa! Datos obtenidos:', response);
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    });
  }
}
