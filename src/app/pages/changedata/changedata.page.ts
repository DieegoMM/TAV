import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutheticationService } from 'src/app/authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changedata',
  templateUrl: './changedata.page.html',
  styleUrls: ['./changedata.page.scss'],
  standalone: false,
})
export class ChangedataPage implements OnInit {
  changeDataForm: FormGroup; // Formulario reactivo

  constructor(
    private formBuilder: FormBuilder,
    private authService: AutheticationService,
    private router: Router
  ) {
    // Inicializa el formulario reactivo
    this.changeDataForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(18)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]], // Valida que tenga exactamente 9 dígitos
    });
  }

  ngOnInit() {
    // Precarga los datos del usuario actual en el formulario
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        const userData = await this.authService.getUserData(user.uid);
        if (userData) {
          this.changeDataForm.patchValue({
            username: userData.username || '',
            age: userData.age || '',
            phoneNumber: userData.phoneNumber || '',
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      alert('Hubo un error al cargar tus datos.');
    }
  }

  async saveChanges() {
    console.log('Estado del formulario:', this.changeDataForm.invalid);
    console.log('Valores del formulario:', this.changeDataForm.value);
  
    if (this.changeDataForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
  
    try {
      const user = await this.authService.getProfile();
      if (user) {
        await this.authService.updateUserData(
          user.uid,
          this.changeDataForm.get('username')?.value, // Nombre de usuario
          this.changeDataForm.get('age')?.value,      // Edad
          this.changeDataForm.get('phone')?.value     // Teléfono
        );
        alert('Datos actualizados con éxito.');
        this.router.navigate(['/profile']);
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      alert('Hubo un error al actualizar los datos.');
    }
  }
  
}
