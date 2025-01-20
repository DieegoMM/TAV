import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutheticationService } from '../authetication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AutheticationService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getProfile();
    console.log('Usuario autenticado en AuthGuard:', user);
    if (user) {
      return true;
    } else {
      alert('No tienes acceso. Por favor inicia sesión.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
