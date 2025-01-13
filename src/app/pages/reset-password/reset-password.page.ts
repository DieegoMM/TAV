import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private authService: AutheticationService
  ) {}

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ✅ Método para enviar el correo de recuperación
  async resetPassword() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    // ✅ Validación manual del formulario
    if (this.resetPasswordForm.valid) {
        try {
            await this.authService.resetPassword(
                this.resetPasswordForm.get('email')?.value
            );
            await loading.dismiss();
            alert('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
        } catch (error) {
            await loading.dismiss();
            alert('Error al enviar el correo: ' + error.message);
        }
    } else {
        alert('Por favor, ingresa un email válido.');
        await loading.dismiss();
    }
}
}
