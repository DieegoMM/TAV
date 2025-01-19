import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userData: any;

  constructor(
    private authService: AutheticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Usar el método público del servicio para escuchar authState
    this.authService.getAuthState().subscribe((user) => {
      if (user) {
        console.log('Usuario autenticado:', user);
        this.loadUserProfile(user.uid); // Cargar datos desde Firestore
      } else {
        console.warn('No se encontró un usuario autenticado.');
        alert('Por favor, inicia sesión primero.');
        this.router.navigate(['/login']); // Redirigir si no hay sesión
      }
    });
  }

  async loadUserProfile(uid: string) {
    try {
      this.userData = await this.authService.getUserData(uid);
      console.log('Datos del usuario cargados:', this.userData);
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }
}
