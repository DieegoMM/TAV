import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { stateMap } from 'src/app/utils/state-map';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  stateMap = stateMap; // Ahora está disponible en la plantilla
  userData: any; // Datos del usuario
  editForm: FormGroup; // Formulario de edición
  products: any[] = [];

  constructor(
    private authService: AutheticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService
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
          try {
            // Obtener datos del usuario autenticado
            const userData = await this.authService.getUserData(user.uid);
            if (userData) {
              this.userData = userData;
  
              // Obtener productos del usuario autenticado
              this.products = await this.productService.getProductsByUser(user.uid);
              console.log('Productos del usuario:', this.products);
            } else {
              console.warn('No se encontraron datos del usuario.');
            }
          } catch (error) {
            console.error('Error al obtener los datos del usuario o productos:', error);
            alert('Hubo un problema al cargar tus datos. Por favor, intenta nuevamente.');
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
          updatedData.phoneNumber, // Número de teléfono
          updatedData.profileImage || 'https://th.bing.com/th/id/OIP.TDTNaTcRv_p8SxiSt4x8qgHaHa?rs=1&pid=ImgDetMain' // Manejo de imagen predeterminada
        );
        alert('Datos actualizados correctamente');
        this.ngOnInit(); // Recargar datos
      } catch (error) {
        console.error('Error al actualizar los datos:', error);
        alert('Hubo un error al guardar los cambios');
      }
    }
  }

  async loadUserData() {
    try {
      const user = await this.authService.getProfile(); // Obtener usuario autenticado
      if (user) {
        this.userData = await this.authService.getUserData(user.uid); // Obtener datos desde Firestore
      } else {
        console.warn('No hay un usuario autenticado.');
        alert('No hay un usuario autenticado. Por favor inicia sesión.');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      alert('Hubo un error al cargar los datos del usuario.');
    }
  }

  async ionViewWillEnter() {
    const user = await this.authService.getProfile();
    if (user) {
      this.products = await this.productService.getProductsByUser(user.uid);
    }
  }

  editProduct(productId: string) {
    console.log('Editando producto con ID:', productId); // Agregar log
    this.router.navigate(['/addproduct', productId]); // Pasa el ID del producto a editar
  }
  
  

}
