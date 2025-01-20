import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: AutheticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ Definiendo el formulario reactivo con validaciones
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  guestLogin() {
    alert('Ingresaste como invitado.');
    this.router.navigate(['/home']); // Redirige al home
  }

  // ✅ Método para iniciar sesión
  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    // ✅ Validación manual al hacer clic en el botón
    if (this.loginForm.valid) {
        try {
            const userCredential = await this.authService.loginUser(
                this.loginForm.get('email')?.value,
                this.loginForm.get('password')?.value
            );

            await loading.dismiss();
            alert('¡Inicio de sesión exitoso!');
            this.router.navigate(['/home']);
        } catch (error) {
            await loading.dismiss();
            alert('Error al iniciar sesión: ' + error.message);
        }
    } else {
        alert('Por favor, completa correctamente los campos.');
        await loading.dismiss();
    }
}

}
