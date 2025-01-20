import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  isAuthenticated: boolean = false; // Variable para saber si el usuario está autenticado

  constructor(private authService: AutheticationService, private router: Router) {}

  async ngOnInit() {
    // Detecta si el usuario está autenticado
    const user = await this.authService.getProfile();
    this.isAuthenticated = !!user;
  }

  // Función para cerrar sesión
  async logout() {
    await this.authService.signOut();
    this.isAuthenticated = false;
    this.router.navigate(['/login']);
  }
}