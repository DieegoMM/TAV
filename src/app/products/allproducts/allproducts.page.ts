import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.page.html',
  styleUrls: ['./allproducts.page.scss'],
  standalone: false,
})
export class AllproductsPage implements OnInit {
  products: any[] = [];
  stateMap = {
    sin_uso: 'Sin uso',
    casi_nuevo: 'Casi nuevo',
    muy_poco_uso: 'Muy poco uso',
    poco_uso: 'Poco uso',
    algo_uso: 'Algo de uso',
    mucho_uso: 'Mucho uso',
    mal_estado: 'Mal estado',
    inutilizable: 'Necesita reparación',
  };

  logProductId(product: any) {
    console.log('ID del producto seleccionado:', product.id); // Esto debería mostrar un ID válido
  }

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    try {
      this.products = await this.productService.getAllProducts();
      console.log('Productos cargados:', this.products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  formatRegion(region: string | undefined): string {
    if (!region) return 'No especificada'; // Si no hay región
    return region
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace("O'higgins", "O'Higgins"); // Caso especial para O'Higgins
  }
  
  
}
