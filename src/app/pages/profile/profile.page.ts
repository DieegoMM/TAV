import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  currentUserId: string | null = null; // Aquí guardaremos el ID del usuario autenticado

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
    this.authService.getAuthState().subscribe(
      async (user) => {
        // Si hay un usuario autenticado, guarda su ID
        this.currentUserId = user ? user.uid : null;
  
        // Obtener el ID del perfil desde la URL
        const profileId = this.activatedRoute.snapshot.paramMap.get('id');
        console.log('Cargando perfil con UID:', profileId);
  
        try {
          // Cargar datos del perfil (propio o ajeno)
          if (profileId) {
            this.userData = await this.authService.getUserData(profileId);
            console.log('Datos del usuario cargados:', this.userData);
  
            // Cargar productos del usuario
            this.products = await this.productService.getProductsByUser(profileId);
            console.log('Productos del usuario:', this.products);
          } else if (user) {
            // Si no hay ID en la URL, pero hay un usuario autenticado, carga su perfil
            this.userData = await this.authService.getUserData(user.uid);
            this.products = await this.productService.getProductsByUser(user.uid);
          } else {
            alert('No se puede cargar el perfil. Inicia sesión o selecciona un usuario válido.');
            this.router.navigate(['/home']);
          }
        } catch (error) {
          console.error('Error al cargar los datos del usuario o productos:', error);
          alert('Hubo un problema al cargar los datos. Por favor, intenta nuevamente.');
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        console.error('Error al verificar el estado de autenticación:', error);
        this.router.navigate(['/home']);
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

}
