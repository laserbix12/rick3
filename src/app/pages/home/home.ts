import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, tap, of } from 'rxjs';
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
  
  query = signal<string>('');
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  private query$ = toObservable(this.query);

  characters = toSignal(
    this.query$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => {
        this.loading.set(true);
        this.hasError.set(false);
      }),
      switchMap((searchTerm) => {
        if (!isPlatformBrowser(this.platformId)) {
          return of([]);
        }

        if (!searchTerm.trim()) {
          // Cargar personajes por defecto si no hay busqueda
          return this.characterService.getCharacters().pipe(
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
        }
        
        // Buscar personajes reales
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

  ngOnInit(): void {
    // Ya no es necesario cargar aqui porque toSignal maneja la carga inicial
  }
}
