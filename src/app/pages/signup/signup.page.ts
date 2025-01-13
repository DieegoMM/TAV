import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';  
import { Router } from '@angular/router';  

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  regForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController, 
    public authService: AutheticationService,
    private firestore: AngularFirestore,  
    private router: Router  
  ) {}

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._-]*[a-zA-Z]{3,}[a-zA-Z0-9._-]*$')
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required, 
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$')
      ]],
      confirmPassword: ['', [Validators.required]], 
      edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]]
    }, { validator: this.passwordsCoinciden });

    // Para validar en tiempo real
    this.regForm.get('confirmPassword')?.valueChanges.subscribe(() => {
        this.regForm.updateValueAndValidity();
    });
  }

  // ✅ Validador personalizado para confirmar contraseñas
  passwordsCoinciden(formGroup: FormGroup) {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password && confirmPassword && password !== confirmPassword
          ? { passwordsNoCoinciden: true }
          : null;
  }

  // ✅ Método con Timeout para forzar el cierre del loading
  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    // ✅ Forzar cierre del loading tras 3 segundos
    setTimeout(() => {
        loading.dismiss();
    }, 3000);  

    if (this.regForm.valid) {
        try {
            // ✅ Registrar al usuario
            const userCredential = await this.authService.registerUser(
                this.regForm.get('email')?.value,
                this.regForm.get('password')?.value
            );

            // ✅ Guardar datos en Firestore
            await this.firestore.collection('users').doc(userCredential.user.uid).set({
                fullname: this.regForm.get('fullname')?.value,
                email: this.regForm.get('email')?.value,
                edad: this.regForm.get('edad')?.value
            });

            alert('¡Usuario registrado con éxito!');
            this.router.navigate(['/home']);  
            
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Error al registrar: ' + error.message);
        }
    } else {
        alert('Por favor, complete todos los campos correctamente.');
    }
}

  // ✅ Getter para facilitar la validación en HTML
  get errorControl() {
      return this.regForm.controls;
  }
}
