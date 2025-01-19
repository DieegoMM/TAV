import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutheticationService } from 'src/app/authetication.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-changedata',
  templateUrl: './changedata.page.html',
  styleUrls: ['./changedata.page.scss'],
  standalone: false,
})
export class ChangedataPage implements OnInit {
  changeDataForm: FormGroup; // Formulario reactivo
  profileImage: string = ''; // Imagen seleccionada o predeterminada

  constructor(
    private formBuilder: FormBuilder,
    private authService: AutheticationService,
    private router: Router
  ) {
    // Inicializa el formulario reactivo
    this.changeDataForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(18)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]], // Número de 9 dígitos
      profileImage: [''], // Control para la imagen
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
            phone: userData.phoneNumber || '',
            profileImage: userData.profileImage || '',
          });
          this.profileImage = userData.profileImage || '';
        }
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      alert('Hubo un error al cargar tus datos.');
    }
  }

  async saveChanges() {
    if (this.changeDataForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      const updatedData = {
        username: this.changeDataForm.get('username')?.value,
        age: this.changeDataForm.get('age')?.value,
        phone: this.changeDataForm.get('phone')?.value,
        profileImage:
          this.changeDataForm.get('profileImage')?.value ||
          'https://via.placeholder.com/150', // Imagen predeterminada
      };

      const user = await this.authService.getProfile();
      if (user) {
        await this.authService.updateUserData(
          user.uid,
          updatedData.username,
          updatedData.age,
          updatedData.phone,
          updatedData.profileImage
        );
        alert('Datos actualizados correctamente.');
        this.router.navigate(['/profile']);
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      alert('Hubo un error al actualizar los datos.');
    }
  }

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Devuelve la imagen en formato base64
        source: CameraSource.Prompt, // Permite elegir entre cámara o galería
      });
  
      if (image?.dataUrl) {
        // Guarda la imagen seleccionada en el formulario reactivo
        this.changeDataForm.patchValue({ profileImage: image.dataUrl });
        console.log('Imagen seleccionada:', image.dataUrl);
      } else {
        console.log('No se seleccionó ninguna imagen.');
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      alert('No se pudo acceder a la cámara o galería. Verifica los permisos o selecciona una imagen.');
    }
  }
  

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Convierte el archivo a Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.changeDataForm.patchValue({ profileImage: base64String });
        this.profileImage = base64String;
      };
      reader.readAsDataURL(file);
    }
  }
}
