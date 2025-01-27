import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { stateMap } from 'src/app/utils/state-map';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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
  currentUserId: string | null = null; // Aquí guardaremos el ID del usuario autenticado
  isAuthenticated: boolean = true; // Cambia a true o false según necesites

  constructor(
    private authService: AutheticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {
    // Configurar el formulario reactivo
    this.editForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
    });
  }

  async ngOnInit() {
    try {
      // Obtener el ID del perfil desde la URL
      const profileId = this.activatedRoute.snapshot.paramMap.get('id');
      console.log('ID en la URL:', profileId);
  
      // Verificar el estado de autenticación
      this.authService.getAuthState().subscribe(async (user: firebase.User | null) => {
        if (user) {
          // Usuario autenticado
          this.currentUserId = user.uid;
          console.log('Usuario autenticado:', user);
  
          if (profileId && profileId !== this.currentUserId) {
            // Perfil de otro usuario
            this.userData = await this.authService.getUserData(profileId);
            this.products = await this.productService.getProductsByUser(profileId);
          } else {
            // Perfil del usuario autenticado
            this.userData = await this.authService.getUserData(this.currentUserId);
            this.products = await this.productService.getProductsByUser(this.currentUserId);
          }
        } else {
          console.log('No hay usuario autenticado.');
          // Cargar perfil de otro usuario incluso si no hay sesión iniciada
          if (profileId) {
            this.userData = await this.authService.getUserData(profileId);
            this.products = await this.productService.getProductsByUser(profileId);
          } else {
            // Si no hay perfil en la URL, redirigir al home
            this.router.navigate(['/home']);
          }
        }
      });
    } catch (error) {
      console.error('Error al cargar los datos del perfil:', error);
      alert('Hubo un problema al cargar los datos. Intenta nuevamente.');
      this.router.navigate(['/home']);
    }
  }
  

  private async loadUserProfile(uid: string) {
    try {
      // Cargar datos del usuario
      this.userData = await this.authService.getUserData(uid);
      console.log('Datos del usuario cargados:', this.userData);

      // Cargar productos del usuario
      this.products = await this.productService.getProductsByUser(uid);
      console.log('Productos del usuario cargados:', this.products);
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
      alert('No se pudieron cargar los datos del perfil.');
    }
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
          updatedData.profileImage || 'https://th.bing.com/th/id/OIP.TDTNaTcRv_p8SxiSt4x8qgHaHa?rs=1&pid=ImgDetMain',
          updatedData.region
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

  async deleteProduct(productId: string) {
    const userConfirmed = confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (userConfirmed) {
      try {
        console.log('Eliminando producto con ID:', productId);
        await this.productService.deleteProduct(productId);
        console.log('Producto eliminado correctamente.');
  
        // Actualiza la lista de productos en la vista
        this.products = this.products.filter(product => product.id !== productId);
  
        alert('Producto eliminado correctamente.');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Hubo un error al intentar eliminar el producto.');
      }
    }
  }  

  copyToClipboard(text: string) {
    if (!navigator.clipboard) {
      console.error('El portapapeles no está soportado en este navegador.');
      alert('Tu navegador no soporta esta función.');
      return;
    }
  
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log(`Texto copiado al portapapeles: ${text}`);
        alert('Copiado al portapapeles.');
      })
      .catch((error) => {
        console.error('Error al copiar al portapapeles:', error);
        alert('Hubo un error al copiar. Intenta nuevamente.');
      });
  }

  formatRegion(region: string | undefined): string {
    if (!region) return 'No especificada'; // Manejo de regiones vacías
    return region
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace("O'higgins", "O'Higgins"); // Caso especial para O'Higgins
  }  

  goToProduct(productId: string) {
    this.router.navigate(['/product-profile', productId]);
  }  

}
