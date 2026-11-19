import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-learn-layout',
  imports: [RouterOutlet, RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './learn-layout.component.html',
  styleUrl: './learn-layout.component.scss'
})
export class LearnLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly user = this.authService.user;

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
