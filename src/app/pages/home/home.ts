import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CharacterService, Character } from '../../core/services/character.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private characterService = inject(CharacterService);
  characters: Character[] = [];

  ngOnInit(): void {
    console.log('Iniciando fetching de datos en Home...');
    this.characterService.getCharacters().subscribe({
      next: (response) => {
        this.characters = response.results;
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    });
  }
}
