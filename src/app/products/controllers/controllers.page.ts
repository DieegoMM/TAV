import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-controllers',
  templateUrl: './controllers.page.html',
  styleUrls: ['./controllers.page.scss'],
  standalone: false, // Para que funcione en Angular Standalone
})
export class ControllersPage implements OnInit {
  controllers: any[] = []; // Lista de productos de tipo "mandos"

  stateMap = {
    sin_uso: 'Sin uso',
    algo_uso: 'Algo de uso',
    casi_nuevo: 'Casi nuevo',
    mal_estado: 'Mal estado',
    inutilizable: 'Necesita reparo',
  };

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    try {
      // Obtener todos los productos desde el servicio
      const allProducts = await this.productService.getAllProducts();
      console.log('Todos los productos:', allProducts);

      // Filtrar los productos cuyo tipo sea "mandos"
      this.controllers = allProducts.filter(
        (product) => product.type === 'mandos'
      );
      console.log('Productos tipo "mandos":', this.controllers);
    } catch (error) {
      console.error('Error al cargar los mandos:', error);
    }
  }
}
