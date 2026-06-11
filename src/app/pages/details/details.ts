import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { CharacterService, Character } from '../../core/services/character.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private characterService = inject(CharacterService);

  character = signal<Character | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.fetchCharacter(id);
      } else {
        this.error.set('Invalid character ID.');
        this.loading.set(false);
      }
    } else {
      this.error.set('No character ID provided.');
      this.loading.set(false);
    }
  }

  fetchCharacter(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.characterService.getCharacterById(id).subscribe({
      next: (data) => {
        this.character.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching character details:', err);
        this.error.set('Failed to load character details.');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
