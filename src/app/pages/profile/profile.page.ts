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
    this.authService.getAuthState().subscribe((user) => {
      if (user) {
        console.log('Usuario autenticado:', user);
        this.loadUserProfile(user.uid); // Carga los datos usando el UID
      } else {
        console.warn('No se encontró un usuario autenticado.');
        alert('Por favor, inicia sesión primero.');
        this.router.navigate(['/login']); // Redirige al login
      }
    });
  }

  async loadUserProfile(uid: string) {
    try {
      console.log('Intentando obtener los datos del usuario con UID:', uid);
      this.userData = await this.authService.getUserData(uid); // Llama al servicio para cargar los datos
      console.log('Datos del usuario cargados:', this.userData); // Verifica qué se cargó
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error); // Maneja errores
    }
  }
}
