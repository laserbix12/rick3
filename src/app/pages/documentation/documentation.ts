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
    { title: 'Introduction', id: 'introduction' },
    { title: 'GraphQL', id: 'graphql' },
    { title: 'REST', id: 'rest' },
    { title: 'JavaScript client', id: 'js-client' },
    { title: 'Info and Pagination', id: 'info-pagination' },
    {
      title: 'Character', id: 'character', children: [
        { title: 'Character schema', id: 'character-schema' },
        { title: 'Get all characters', id: 'get-all-characters' },
        { title: 'Get a single character', id: 'get-single-character' },
        { title: 'Get multiple characters', id: 'get-multiple-characters' },
        { title: 'Filter characters', id: 'filter-characters' },
      ]
    },
    {
      title: 'Location', id: 'location', children: [
        { title: 'Location schema', id: 'location-schema' },
        { title: 'Get all locations', id: 'get-all-locations' },
        { title: 'Get a single location', id: 'get-single-location' },
        { title: 'Get multiple locations', id: 'get-multiple-locations' },
        { title: 'Filter locations', id: 'filter-locations' },
      ]
    },
    {
      title: 'Episode', id: 'episode', children: [
        { title: 'Episode schema', id: 'episode-schema' },
        { title: 'Get all episodes', id: 'get-all-episodes' },
        { title: 'Get a single episode', id: 'get-single-episode' },
        { title: 'Get multiple episodes', id: 'get-multiple-episodes' },
        { title: 'Filter episodes', id: 'filter-episodes' },
      ]
    },
    {
      title: 'Libraries', id: 'libraries', children: [
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
