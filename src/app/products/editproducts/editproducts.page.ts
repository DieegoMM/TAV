import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { AutheticationService } from '../../authetication.service';

@Component({
  selector: 'app-editproducts',
  templateUrl: './editproducts.page.html',
  styleUrls: ['./editproducts.page.scss'],
  standalone: false,
})
export class EditproductsPage implements OnInit {
  userProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private authService: AutheticationService // Servicio para autenticación
  ) {}

  async ngOnInit() {
    try {
      // Obtén el usuario autenticado
      const user = await this.authService.getProfile();
      if (user && user.uid) {
        // Usa el UID del usuario autenticado para obtener sus productos
        this.userProducts = await this.productService.getProductsByUser(user.uid);
      } else {
        console.warn('No hay usuario autenticado.');
      }
    } catch (error) {
      console.error('Error al cargar productos del usuario:', error);
    }
  }

  editProduct(productId: string) {
    // Lógica para redirigir a una página de edición o abrir un modal
    console.log('Editar producto con ID:', productId);
  }
}
