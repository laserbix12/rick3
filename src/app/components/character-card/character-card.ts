import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../core/services/character.service';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './character-card.scss',
})
export class CharacterCardComponent {
  character = input.required<Character>();
}
