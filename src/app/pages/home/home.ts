import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap, of, Subject, filter, takeUntil } from 'rxjs';
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
export class HomeComponent implements OnInit, OnDestroy {
  private characterService = inject(CharacterService);
  private platformId = inject(PLATFORM_ID);

  query = signal<string>('');
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  characters = signal<Character[]>([]);
  
  private currentPage = 1;
  private hasMore = true;
  private isLoadingMore = false;
  
  private query$ = toObservable(this.query);
  private destroy$ = new Subject<void>();
  private loadMore$ = new Subject<void>();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

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
      switchMap(searchTerm => this.fetchCharacters(searchTerm, this.currentPage)),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.handleResponse(res, true);
    });

    this.loadMore$.pipe(
      filter(() => this.hasMore && !this.loading() && !this.isLoadingMore),
      tap(() => {
        this.isLoadingMore = true;
        this.currentPage++;
      }),
      switchMap(() => this.fetchCharacters(this.query(), this.currentPage)),
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.handleResponse(res, false);
      this.isLoadingMore = false;
    });
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
    this.characters.update(chars => isNewQuery ? res.results : [...chars, ...res.results]);
  }

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (documentHeight - (scrollTop + windowHeight) < 400) {
      this.loadMore$.next();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
