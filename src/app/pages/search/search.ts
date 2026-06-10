import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, tap, of } from 'rxjs';
import { CharacterService, Character } from '../../core/services/character.service';
import { CharacterCardComponent } from '../../components/character-card/character-card';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private characterService = inject(CharacterService);

  query = signal<string>('');
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  private query$ = toObservable(this.query);

  characters = toSignal(
    this.query$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap((searchTerm) => {
        if (searchTerm.trim()) {
          this.loading.set(true);
          this.hasError.set(false);
        } else {
          this.loading.set(false);
          this.hasError.set(false);
        }
      }),
      switchMap((searchTerm) => {
        if (!searchTerm.trim()) {
          return of([]);
        }
        return this.characterService.searchCharacters(searchTerm).pipe(
          map(res => {
            this.loading.set(false);
            return res.results;
          }),
          catchError(() => {
            this.loading.set(false);
            this.hasError.set(true);
            return of([]);
          })
        );
      })
    ),
    { initialValue: [] as Character[] }
  );
}
