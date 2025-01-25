import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AutheticationService } from '../authetication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AutheticationService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const user = await this.authService.getProfile().catch(() => null); // Obtener el usuario autenticado (puede ser null si es invitado)
    const userId = route.params['id']; // Obtener el ID del usuario de la URL (si existe)
  
    console.log('Usuario autenticado:', user);
    console.log('ID en la URL:', userId);
  
    // Caso 1: Invitado intenta acceder a su propio perfil (sin un ID en la URL)
    if (!user && !userId) {
      alert('Los invitados no tienen un perfil propio.');
      this.router.navigate(['/home']); // Redirigir al inicio
      return false;
    }
  
    // Caso 2: Invitado intenta acceder al perfil de otro usuario (con un ID en la URL)
    if (!user && userId) {
      console.log('Acceso permitido al perfil ajeno como invitado.');
      return true; // Permitir el acceso
    }
  
    // Caso 3: Usuario autenticado accede a cualquier perfil
    if (user) {
      console.log('Acceso permitido al usuario autenticado.');
      return true; // Permitir el acceso
    }
  
    // Caso 4: Por defecto, denegar el acceso
    alert('No tienes acceso.');
    this.router.navigate(['/login']);
    return false;
  }  
  
}
