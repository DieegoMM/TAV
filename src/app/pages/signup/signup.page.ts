import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {
  regForm: FormGroup;

  regiones: string[] = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana de Santiago',
    'O’Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén',
    'Magallanes y Antártica Chilena'
  ];

  constructor(
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private authService: AutheticationService,
    private afAuth: AngularFireAuth, // Servicio de Firebase Auth
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.regForm = this.formBuilder.group(
      {
        fullname: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9._-]{3,}[a-zA-Z0-9._-]*$'), // Validación del nombre
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        edad: [
          '',
          [Validators.required, Validators.min(18), Validators.max(100)],
        ],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{9}$'), // Valida exactamente 9 números
          ],
        ],
        region: ['', Validators.required], // Nuevo campo para la región
      },
      { validator: this.passwordsCoinciden } // Validador personalizado para contraseñas
    );

    // Validación en tiempo real
    this.regForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.regForm.updateValueAndValidity();
    });
  }

  // Validador para verificar si las contraseñas coinciden
  passwordsCoinciden(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsNoCoinciden: true }
      : null;
  }

  // Método para registrar al usuario
  async signUp() {
    // Validar que el formulario esté completo
    if (this.regForm.invalid) {
      alert('Por favor, complete todos los campos correctamente.');
      return; // Salir si el formulario no es válido
    }

    // Mostrar loading mientras se procesa el registro
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      // Registrar al usuario en Firebase Authentication
      const userCredential = await this.authService.registerUser(
        this.regForm.get('email')?.value,
        this.regForm.get('password')?.value
      );

       // Depuración: Verificar el usuario registrado
      console.log('Usuario registrado:', userCredential.user);

      // Verificar si el usuario se creó correctamente
      if (userCredential.user) {
        // Guardar datos adicionales en Firestore
        await this.firestore.collection('users').doc(userCredential.user.uid).set({
          fullname: this.regForm.get('fullname')?.value, // Nombre completo
          email: this.regForm.get('email')?.value, // Email
          edad: this.regForm.get('edad')?.value, // Edad
          phone: this.regForm.get('phone')?.value, // Guardar el número de teléfono
          region: this.regForm.get('region')?.value, // Guardar la región seleccionada
          createdAt: new Date(), // Fecha de creación
        });

        alert('¡Usuario registrado con éxito!');

        // Depuración: Confirmar redirección
      console.log('Redirigiendo a la página de perfil...');
      this.router.navigate(['/home']); // Redirige al perfil
      
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Hubo un error: ' + error.message); // Mostrar mensaje de error
    } finally {
      // Ocultar loading
      loading.dismiss();
    }
  }

  // Getter para facilitar la validación en HTML
  get errorControl() {
    return this.regForm.controls;
  }
  
}
