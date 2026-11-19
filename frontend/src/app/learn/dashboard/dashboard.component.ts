import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

interface LangCard {
  code: string;
  name: string;
  nativeName: string;
  progress: number;
  lessonsTotal: number;
  lessonsDone: number;
  primaryColor: string;
  secondaryColor: string;
  started: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  readonly user = this.authService.user;

  readonly stats = [
    { value: '0', label: 'Уроков', icon: 'menu_book' },
    { value: '0', label: 'Слов', icon: 'translate' },
    { value: '0', label: 'Дней подряд', icon: 'local_fire_department' },
    { value: '—', label: 'Точность', icon: 'target' }
  ];

  readonly languages: LangCard[] = [
    {
      code: 'es',
      name: 'Español',
      nativeName: 'Испанский',
      progress: 0,
      lessonsTotal: 22,
      lessonsDone: 0,
      primaryColor: '#c60b1e',
      secondaryColor: '#f1bf00',
      started: false
    },
    {
      code: 'ca',
      name: 'Català',
      nativeName: 'Каталанский',
      progress: 0,
      lessonsTotal: 22,
      lessonsDone: 0,
      primaryColor: '#c60b1e',
      secondaryColor: '#fcdd09',
      started: false
    }
  ];
}
