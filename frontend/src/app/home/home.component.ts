import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly user = this.authService.user;

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
