import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './support.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './support.scss',
})
export class SupportComponent {}
