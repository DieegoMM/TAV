import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutheticationService } from 'src/app/authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
  standalone: false,

})
export class ChangepasswordPage implements OnInit {
  passwordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AutheticationService,
    private router: Router
  ) {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required]], // Contraseña actual
      newPassword: ['', [Validators.required, Validators.minLength(6)]], // Nueva contraseña
    });
  }

  ngOnInit() {}

  async updatePassword() {
    if (this.passwordForm.invalid) {
      alert('Por favor, completa el formulario correctamente.');
      return;
    }
  
    try {
      const currentPassword = this.passwordForm.get('currentPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;
  
      // Llama a la función del servicio para actualizar la contraseña
      await this.authService.updatePassword(currentPassword, newPassword);
      alert('Contraseña actualizada correctamente.');
      this.router.navigate(['/profile']); // Redirige al perfil o donde prefieras
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      alert('Hubo un error al actualizar la contraseña.');
    }
  }
}
