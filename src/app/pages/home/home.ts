import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  tap,
  of,
  Subject,
  filter,
  takeUntil
} from 'rxjs';
import { CharacterService, Character } from '../../core/services/character.service';
import { CharacterCardComponent } from '../../components/character-card/character-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, CharacterCardComponent],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  // El anchor siempre está en el DOM → observer nunca pierde la referencia
  @ViewChild('scrollAnchor') scrollAnchor?: ElementRef;
  private observer: IntersectionObserver | null = null;

  private characterService = inject(CharacterService);
  private platformId = inject(PLATFORM_ID);

  query = signal<string>('');
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  characters = signal<Character[]>([]);
  isFetchingMore = signal<boolean>(false);

  private currentPage = 1;
  private hasMore = true;

  private query$ = toObservable(this.query);
  private destroy$ = new Subject<void>();
  private loadMore$ = new Subject<void>();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Búsqueda con debounce — resetea al cambiar query
    this.query$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => {
        this.loading.set(true);
        this.hasError.set(false);
        this.currentPage = 1;
        this.hasMore = true;
        this.characters.set([]);
      }),
      switchMap(term => this.fetchCharacters(term, this.currentPage)),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.handleResponse(res, true);
    });

    // Carga de más personajes al llegar al final
    this.loadMore$.pipe(
      filter(() => this.hasMore && !this.loading() && !this.isFetchingMore()),
      tap(() => {
        this.isFetchingMore.set(true);
        this.currentPage++;
      }),
      switchMap(() => this.fetchCharacters(this.query(), this.currentPage)),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.handleResponse(res, false);
      this.isFetchingMore.set(false);
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // El anchor está SIEMPRE en el DOM → se puede observar directamente
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.loadMore$.next();
        }
      },
      { rootMargin: '400px', threshold: 0 }
    );

    if (this.scrollAnchor) {
      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }

  private fetchCharacters(searchTerm: string, page: number) {
    if (!searchTerm.trim()) {
      return this.characterService.getCharacters(page).pipe(
        catchError(() => of(null))
      );
    }
    return this.characterService.searchCharacters(searchTerm, page).pipe(
      catchError(() => of(null))
    );
  }

  private handleResponse(res: any, isNewQuery: boolean) {
    this.loading.set(false);
    if (!res || !res.results) {
      if (isNewQuery) this.hasError.set(true);
      this.hasMore = false;
      return;
    }
    this.hasMore = res.info?.next !== null;
    this.characters.update(chars =>
      isNewQuery ? res.results : [...chars, ...res.results]
    );
  }

  ngOnDestroy(): void {
    if (this.observer) this.observer.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
