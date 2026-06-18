import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavSection {
  title: string;
  id: string;
  children?: { title: string; id: string }[];
}

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documentation.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './documentation.scss',
})
export class DocumentationComponent {
  sidebarOpen = signal(false);
  activeSection = signal('introduction');

  navSections: NavSection[] = [
    { title: 'Introducción', id: 'introduction' },
    { title: 'GraphQL', id: 'graphql' },
    { title: 'REST', id: 'rest' },
    { title: 'Cliente JavaScript', id: 'js-client' },
    { title: 'Info y Paginación', id: 'info-pagination' },
    {
      title: 'Personaje', id: 'character', children: [
        { title: 'Esquema de personaje', id: 'character-schema' },
        { title: 'Obtener todos los personajes', id: 'get-all-characters' },
        { title: 'Obtener un personaje', id: 'get-single-character' },
        { title: 'Obtener varios personajes', id: 'get-multiple-characters' },
        { title: 'Filtrar personajes', id: 'filter-characters' },
      ]
    },
    {
      title: 'Ubicación', id: 'location', children: [
        { title: 'Esquema de ubicación', id: 'location-schema' },
        { title: 'Obtener todas las ubicaciones', id: 'get-all-locations' },
        { title: 'Obtener una ubicación', id: 'get-single-location' },
        { title: 'Obtener varias ubicaciones', id: 'get-multiple-locations' },
        { title: 'Filtrar ubicaciones', id: 'filter-locations' },
      ]
    },
    {
      title: 'Episodio', id: 'episode', children: [
        { title: 'Esquema de episodio', id: 'episode-schema' },
        { title: 'Obtener todos los episodios', id: 'get-all-episodes' },
        { title: 'Obtener un episodio', id: 'get-single-episode' },
        { title: 'Obtener varios episodios', id: 'get-multiple-episodes' },
        { title: 'Filtrar episodios', id: 'filter-episodes' },
      ]
    },
    {
      title: 'Librerías', id: 'libraries', children: [
        { title: 'Dart', id: 'lib-dart' },
        { title: 'Elixir', id: 'lib-elixir' },
        { title: 'Go', id: 'lib-go' },
        { title: 'Java', id: 'lib-java' },
        { title: '.NET', id: 'lib-dotnet' },
        { title: 'PHP', id: 'lib-php' },
        { title: 'Python', id: 'lib-python' },
        { title: 'R', id: 'lib-r' },
        { title: 'Ruby', id: 'lib-ruby' },
        { title: 'Rust', id: 'lib-rust' },
        { title: 'Swift', id: 'lib-swift' },
      ]
    },
  ];

  scrollTo(id: string) {
    this.activeSection.set(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.sidebarOpen.set(false);
  }

  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }
}
