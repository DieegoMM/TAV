import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutheticationService } from 'src/app/authetication.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import imageCompression from 'browser-image-compression';

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
      fullname: ['', [Validators.required, Validators.minLength(3)]], // El nombre es obligatorio y debe tener al menos 3 caracteres
      edad: ['', [Validators.required, Validators.min(18)]],          // La edad es obligatoria y debe ser mayor o igual a 18
      phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]], // El teléfono debe ser un número de 9 dígitos
      profileImage: [''] // No requiere validación ya que es opcional
    });
  }

  async ngOnInit() {
    try {
      const user = await this.authService.getProfile(); // Obtiene el usuario autenticado
      if (user) {
        await this.loadUserData(user.uid); // Pasa el uid a loadUserData
      } else {
        alert('No hay usuario autenticado. Por favor inicia sesión.');
        this.router.navigate(['/login']); // Redirige al login si no hay usuario
      }
    } catch (error) {
      console.error('Error al verificar la sesión del usuario:', error);
      alert('Hubo un problema al verificar la sesión.');
      this.router.navigate(['/login']); // Redirige si ocurre un error
    }
  }

  async loadUserData(uid: string) {
    try {
      const userData = await this.authService.getUserData(uid); // Usa el uid para obtener los datos
      if (userData) {
        this.changeDataForm.patchValue({
          username: userData.fullname || '',
          age: userData.edad || '',
          phone: userData.phone || '',
          profileImage: userData.profileImage || '',
        });
      } else {
        console.warn('No se encontraron datos para el usuario.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      alert('Hubo un error al cargar los datos del usuario.');
    }
  }
  async saveChanges() {
    if (this.changeDataForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
  
    try {
      const updatedData = {
        fullname: this.changeDataForm.get('fullname')?.value, // Campo fullname
        edad: this.changeDataForm.get('edad')?.value,         // Campo edad
        phone: this.changeDataForm.get('phone')?.value,       // Campo phone
        profileImage: this.changeDataForm.get('profileImage')?.value || '' // Campo profileImage
      };
  
      const user = await this.authService.getProfile();
      if (user) {
        await this.authService.updateUserData(
          user.uid,
          updatedData.fullname,
          updatedData.edad,
          updatedData.phone,
          updatedData.profileImage
        );
        alert('Datos actualizados correctamente.');
      } else {
        alert('No hay un usuario autenticado.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      alert('Hubo un error al actualizar los datos.');
    }
  }
  

  async selectImage() {
    try {
      // Obtener la imagen desde la cámara o galería
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Devuelve imagen en formato base64
        source: CameraSource.Prompt, // Permite elegir entre cámara o galería
      });
  
      if (image.dataUrl) {
        // Convertir y comprimir la imagen
        const compressedImage = await imageCompression.getDataUrlFromFile(
          await imageCompression(
            this.dataURLtoFile(image.dataUrl, 'profileImage.jpg'),
            { maxSizeMB: 0.5, maxWidthOrHeight: 1024 }
          )
        );
  
        // Guardar la imagen comprimida en el formulario reactivo
        this.changeDataForm.patchValue({ profileImage: compressedImage });
        console.log('Imagen comprimida seleccionada:', compressedImage);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
      alert('No se pudo acceder a la cámara o galería.');
    }
  }
  
  // Helper para convertir Base64 a archivo
  dataURLtoFile(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
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
