import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  userData: any; // Datos del usuario
  editForm: FormGroup; // Formulario de edición

  constructor(
    private authService: AutheticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // Configurar el formulario reactivo
    this.editForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.authService.getAuthState().subscribe(
      async (user) => {
        if (user) {
          console.log('Usuario autenticado:', user);
          const userData = await this.authService.getUserData(user.uid);
          if (userData) {
            this.userData = userData;
          }
        } else {
          console.warn('No se encontró un usuario autenticado.');
          alert('Por favor, inicia sesión primero.');
          this.router.navigate(['/login']); // Redirige al login si no está autenticado
        }
      },
      (error) => {
        console.error('Error al verificar el estado de autenticación:', error);
        this.router.navigate(['/login']);
      }
    );
  }

  // Método para guardar cambios
  async saveChanges() {
    if (this.userData) {
      const uid = this.userData.uid; // UID del usuario actual
      const updatedData = this.editForm.value; // Obtener datos del formulario

      try {
        await this.authService.updateUserData(
          uid,
          updatedData.username, // Nombre de usuario
          updatedData.age,      // Edad
          updatedData.phoneNumber // Número de teléfono
        );
        alert('Datos actualizados correctamente');
        this.ngOnInit(); // Recargar datos
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
        alert('Hubo un error al guardar los cambios');
      }
    }
  }
}
